const CustomError = require ('../utils/error_abstract_class');

const ErrorHandler = (error,req,res,next)=>{
  if(error instanceof CustomError){
    console.log(error.statuscode);
    res.status(error.statuscode).json({error:error.serializeErrors()});
    return true;
  }
  res.status(400).json({error:[{message:error.message}]});
};

module.exports = ErrorHandler;