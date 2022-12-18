const jwt = require('jsonwebtoken');
const { Unauthorised } = require('../Error_handlers/customerrors');
const User = require('../models/user');
const LoggedInUser = async (req, res, next)=>{
  token = req.header('authorization');
  if(!token){
    console.log(token);
    throw Unauthorised('User not loged in')
  }
  try {
    const payload = jwt.verify(req.session.jwt,'Mukundijoe254');
    if(!payload.isActive){
      throw Unauthorised('please activate account')
    }
    if(!payload.isSuspended){
      throw Unauthorised('Due to infringment of our policies your account is suspended')
    }
    req.user = await User.findOne({email:payload.email});
    next();
  } catch (error) {
    console.log(error);
    throw InternalServerError(error)

  }
}

module.exports = LoggedInUser;