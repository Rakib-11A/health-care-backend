/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { config } from "../config/env";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error("X Error: ", err);

    let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message || 'Internal Server Error';

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

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(config.nodeEnv === 'development' && { error: err})
    })
}