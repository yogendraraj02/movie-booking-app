// src/utils/AppError.ts
export default class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
  
    constructor(statusCode: number, message: string, isOperational = true) {
      super(message);
  
      this.statusCode = statusCode;
      this.isOperational = isOperational;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  