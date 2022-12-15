const CustomError = require ('../utils/error_abstract_class');

class BadRequestError extends CustomError {
  constructor(errormessage){
    this.errormsg = [{error : errormessage}]
    super(401,this.errormsg);
  }
}
class DBError extends CustomError{
  constructor(errormessage){
    this.errormsg = [{error : errormessage}]
    super(500,this.errormsg);
  }
}
class Unauthorised extends CustomError{
  constructor(errormessage){
    this.errormsg = [{error : errormessage}]
    super(401,this.errormsg);
  }
}
class InternalServerError extends CustomError{
  constructor(errormessage){
    this.errormsg = [{error : errormessage}]
    super(500,this.errormsg);
  }
}
class ValidatorError extends CustomError{
  constructor(errormessage){
    this.errormsg = [{error : errormessage}]
    super(401,this.errormsg);
  }
  static prepearError (errormsg){
    const errorArray = errormsg.errors;
    const message = errorArray.map(errorObj => {
      const msg = errorObj.msg
      const param = errorObj.param
      return { error : `validation error: ${msg} for parameter ${param}` }
    });
    return message
  }
}
module.exports = {BadRequestError, DBError, Unauthorised, InternalServerError, ValidatorError};