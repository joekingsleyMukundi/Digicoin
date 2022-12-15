const express = require('express');
const { body } = require('express-validator');
const { register, activate, signin, forgotpass, resetPassword } = require('../../controllers/auth/auth');
const { getUserByEmail } = require('../../services/queries');
const  router = express.Router();

router.post('/regiseteruser',
[
  body('username').not().isEmpty().trim(),
  body('email').trim().isEmail()
  .custom(mail =>{
    return getUserByEmail(mail)
    .then((data)=>{
      if(data){
        return Promise.reject('User already exists')
      }
    })
    .catch(error =>{
      return Promise.reject(error)
    })
  })
  .normalizeEmail(),
  body('password').trim().isLength({ min:6 }).isAlphanumeric(),
  body('passwordConfirmation').trim().custom((value, { req })=>{
    if(value !== req.body.password){
      return  Promise.reject("Password mismatched");
    }
    return true;
  })
 ] ,register);

 router.get('/activate', activate);
 router.post('/signnin', 
 [
  body('email')
  .trim()
  .isEmail()
  .custom(mail =>{
    return getUserByEmail(mail)
    .then((data)=>{
      if(!data){
        return Promise.reject('User with that email doesnot exist')
      }
    })
    .catch(error =>{
      return Promise.reject(error)
    })
  })
  .normalizeEmail()
  .withMessage("Invalid email!"),
  body('password')
  .trim()
  .isLength({ min : 6 })
  .isAlphanumeric()
 ],
 signin
 );
router.post('/forgotpassword',[
  body('email')
  .trim()
  .isEmail()
  .custom(mail =>{
    return getUserByEmail(mail)
    .then((data)=>{
      if(!data){
        return Promise.reject('User with that email doesnot exist')
      }
    })
    .catch(error =>{
      return Promise.reject(error)
    })
  })
  .normalizeEmail()
  .withMessage("Invalid email!"),
],forgotpass);
router.post('/resetpassword',[
  body('password')
  .trim()
  .isLength({ min : 6 })
  .isAlphanumeric()
],resetPassword);
module.exports=router;