// Way - 1
import dotenv from 'dotenv';
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
}

const loadEnvVariables = (): EnvConfig => {
    const requireEnvVariables = [
        'NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'BETTER_AUTH_SECRET',
        'BETTER_AUTH_URL'
    ]

    requireEnvVariables.forEach((variable) => {
        if(!process.env[variable]){
            throw new Error(`Environment variable ${variable} is required but not set in .env file.`);
        }
    })
    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    }
}

export const envVars = loadEnvVariables();