import express, { Application, Request, Response } from "express"
import { IndexRoutes } from "./app/routes";
import { errorHandler } from "./app/middlewares/error.middleware";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import { envVars } from "./app/config/env";

const app: Application = express();

app.set("view engine", "ejs")
app.set("views", path.resolve(process.cwd(), `src/app/templates`))

app.use(cors({
    origin: [
        envVars.FRONTEND_URL,
        envVars.BETTER_AUTH_URL,
        'http://localhost:5000',
        'http://localhost:300'
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/api/auth', toNodeHandler(auth))
// Enable URL-encoded form data parsing
app.use(express.urlencoded({extended: true}));

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cookieParser());

app.use('/api/v1', IndexRoutes);

// Basic route
app.get('/', async (req: Request, res: Response) => {
    // throw new AppError(status.BAD_REQUEST, "just testing error handler");
    res.status(200).json({
        success: true,
        message: "Health Care API is running and working file, Alhamdulillah....!!!"
    });
});


// Error Handler
app.use(errorHandler);

// Not Found Route Handler
app.use(notFound)

export default app;