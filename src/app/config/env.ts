import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({path: path.join(process.cwd(), '.env')});

export const config = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV as string,
    betterAuthUrl: process.env.BETTER_AUTH_URL as string,
}