const User = require("../models/user")

const getUserByEmail = async (email)=>{
  const user = await User.findOne({email});
  if(!user){
    return false;
  }
  return user;
}
const getUserById = async (id)=>{
  const user = await User.findById(id)
  if(!user){
    return false;
  }
  return user;
}
module.exports={getUserByEmail, getUserById};