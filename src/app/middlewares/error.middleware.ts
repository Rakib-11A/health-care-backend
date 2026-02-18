/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import z from "zod";
import status from "http-status";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(envVars.NODE_ENV === 'development'){
        console.log("Error from Global Error Handler ", err)
    }

    let errorSources : TErrorSources[] = [];
    let statusCode : number = res.statusCode !== 200 ? res.statusCode : 500;
    let message : string = err.message || 'Internal Server Error';

    // Handle Prisma Errors
    if(err.code === 'P2025') {
        // Record not found
        statusCode = 404;
        message = 'Resource not found';
    }else if(err.code === 'P2002'){
        // Unique constraint violation
        statusCode = 400;
        message = 'This record already exists';
    } else if (err.code?.startsWith('P')) {
        // Other prisma errors
        statusCode = 400;
        message = 'Databse error occurred';
    }

    if(err instanceof z.ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message;

        errorSources = [...simplifiedError.errorSources!]
    }

    const errorResponse : TErrorResponse = {
        success: false,
        message: message,
        errorSources,
        error: envVars.NODE_ENV === 'development'? err : undefined
    }
    res.status(statusCode).json(errorResponse);
}