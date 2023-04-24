import { NextFunction } from 'express'
import { IAppError } from '../interfaces/AppError.interface'

export const appError = (httpStatus: number, errMessage: string, next: NextFunction): void => {
    console.log(httpStatus,errMessage)
    const error: IAppError = new Error(errMessage) as IAppError;
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
}

