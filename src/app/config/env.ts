// Way - 1
import dotenv from 'dotenv';
import AppError from '../errorHelpers/AppError';
import status from 'http-status';
// import path from 'node:path';

// dotenv.config({path: path.join(process.cwd(), '.env')});


// export const config = {
//     port: process.env.PORT,
//     nodeEnv: process.env.NODE_ENV as string,
//     betterAuthUrl: process.env.BETTER_AUTH_URL as string,
// }

// Way - 2

dotenv.config();

interface EnvConfig {
    NODE_ENV: string,
    PORT: string;
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SCERET: string;
    ACCESS_TOEKN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string;
    BETTER_AUTH_SESSION_TOEKN_UPDATE_AGE: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requireEnvVariables = [
        'NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'BETTER_AUTH_SECRET',
        'BETTER_AUTH_URL',
        'ACCESS_TOKEN_SECRET',
        'REFRESH_TOKEN_SCERET',
        'ACCESS_TOEKN_EXPIRES_IN',
        'REFRESH_TOKEN_EXPIRES_IN',
        'BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN',
        'BETTER_AUTH_SESSION_TOEKN_UPDATE_AGE'
    ]

    requireEnvVariables.forEach((variable) => {
        if(!process.env[variable]){
            // throw new Error(`Environment variable ${variable} is required but not set in .env file.`);
            throw new AppError(status.INTERNAL_SERVER_ERROR, `Eenvironment variable ${variable} is required but not set in .env file.`);
        }
    })
    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SCERET: process.env.REFRESH_TOKEN_SCERET as string,
        ACCESS_TOEKN_EXPIRES_IN: process.env.ACCESS_TOEKN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOEKN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOEKN_UPDATE_AGE as string
    }
}

export const envVars = loadEnvVariables();