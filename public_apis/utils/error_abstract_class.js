class CustomError extends Error{
  constructor(statuscode,message){
    super();
    //due to inheriting  a built class  ie error class
    Object.setPrototypeOf(this, CustomError.prototype);

    this.statuscode = statuscode;
    this.message = message;
  }

  serializeErrors (){
    return {
      error : this.message,
    }
  }
}

module.exports = CustomError;