class CustomError extends Error {
    statusCode: number;
    message: string;
    
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      // Mantener el stack trace original
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }
    }
  }

    export default CustomError;
  