
const moment = require('moment');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const jsonwebtoken  =  require('jsonwebtoken');
const { ValidatorError, InternalServerError, DBError, Unauthorised, BadRequestError } = require('../../Error_handlers/customerrors');
const User = require('../../models/user');
const { getUserById, getUserByEmail } = require('../../services/queries');
const Password = require('../../utils/passwordhasher');
const { sendMail } = require('../../utils/sendmail');
const Wallet = require('../../../core/wallet/wallet');
const WalletModel = require('../../models/wallet');
exports.register= async (req,res, next)=>{
  const validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    const errors = ValidatorError.prepearError(validationErrors.array());
    throw new ValidatorError(errors);
  }
  const { username, email, password }= req.body;
  const referalId = req.query.id;
  try {
    const newUser = new User({ username, email, password })
    const registerduser =  await newUser.save();
    if(referalId){
      const upline = await User.findById(referalId);
      upline.downlines.push(registerduser);
      await upline.save();
    }
    const activateurl = `${req.protocol}://127.0.0.1/activate?id=${registerduser.id}`;
    const message  = `Welcome on board lets get you started 'by' activating your account. Please click this link ${activateurl}`;
    const subj = "Acount activation";
    await sendMail (user.username,user.email,subj,message);
    res.status(200).json({message:"Successfull registration. Please head to your email to start off your account"})
  } catch (error) {
    console.log(error);
    throw new InternalServerError('Internal server error')
  }
}
exports.activate= async (req,res,next)=>{
  const user_id = req.query.id;
  getUserById(user_id)
  .then(async user=>{
    user.isActive = true;
    await user.save();
    const wallet = new Wallet();
    const walletData = new WalletModel({keyPair:wallet.keyPair, publicKey:wallet.publicKey});
    await walletData.save();
    res.status(201).json({
      message:"user wallet created and user activated!"
    })
  })
  .catch(error=>{
    console.log(error);
    throw new DBError("internal server error");
  })
}

exports.signin= async (req,res, next)=>{
  const validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    const errors = ValidatorError.prepearError(validationErrors.array());
    throw new ValidatorError(errors);
  }
  const { email, password } = req.body;
  getUserByEmail(email)
  .then( user => {
    if(!user){
      throw new Unauthorised('user doesnot exist');
    }
    const matchedPassword = Password.compare(user.password, password)
    if(!matchedPassword){
      throw new BadRequestError('invalid password');
    }
    const webtoken = jsonwebtoken
    .sign({
      id:user.id,
      email:user.email,
      isActive:user.isActive,
      isVerified:user.isVerified,
      isSuspended:user.isSuspended,
    },
    'Mukundijoe254',
    {
      expiresIn: '1d',
    });
    res.status(201).json({
      message : "user login success",
      jwt: webtoken
    })
  })
  .catch(error => {
    console.log(error);
    throw new InternalServerError("Internal server error");
  })

}
exports.forgotpass = async (req,res,next)=>{
  const validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    const errors = ValidatorError.prepearError(validationErrors.array());
    throw new ValidatorError(errors);
  }
  if(req.method == 'POST'){
    if (req.query.email == "") {
      res.status(200).json({message:"empty values"})
      return
    }
    console.log(req.query.email);
    const user = await User.findOne({email:req.query.email});
    if(!user){
      res.status(200).json({message:"User des not exist"})
      return
    }

    const resetToken = user.getResetPasswordToken();
    console.log(resetToken);
    const reseturl = `${req.protocol}://${req.host}/resetpwd?resettoken=${resetToken}`;
    const message  = `You are receiving this email because you (or someone else) has requested a reset of password. Please click this link ${reseturl}`;
    const subj = "Password Reset";
    try {
      await sendMail(user.username,user.email,subj,message);
      res.status(200).json({message:"Reset instructions have been sent to your email"})
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPassworExpire = undefined;
      await user.save({validateBeforeSave: false});
      res.status(500).json({message:"internal server error"})
    }
    await user.save(
      {
        validateBeforeSave: false
      }
    );
  }
};

exports.resetPassword = async (req,res,next)=>{
  // get hashed token
  console.log(req.params);
  console.log(req);
  const resetpassToken  = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
  console.log(resetpassToken);
  const user = await User.findOne({
    resetPasswordToken : resetpassToken,
  });

  console.log(user);
  if(!user){
    res.status(200).json({message:"user doesnot exist"})
    return ;
  }
  if(req.method == 'POST'){
    if (req.body.newpassword == "") {
      res.status(200).json({message:'password must be entered'})
      return;
    }
    // set new pass
    const unfomatedDate = new Date();
    const updateDate = moment(unfomatedDate).format('YYYY-MM-DD');
    user.password = req.query.newpassword;
    user.updatedAt= updateDate;
    user.resetPasswordToken = undefined;
    user.resetPassworExpire= undefined;
    await user.save();
    res.status(200).json({message:"password reset successfully"})
    return
  }
};
