import express, { Application, Request, Response } from "express"
import { prisma } from "./app/lib/prisma";
import { IndexRoutes } from "./app/routes";
import { errorHandler } from "./app/middlewares/error.middleware";
import { notFound } from "./app/middlewares/notFound";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({extended: true}));

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/api/v1', IndexRoutes);

// Basic route
app.get('/', async (req: Request, res: Response) => {
    const speciality = await prisma.speciality.findFirst({
        where: {
            title: "Neurologist"
        }
    });
    res.status(200).json({
        success: true,
        message: "Spaciality created successfully...",
        data: speciality
    });
});


// Error Handler
app.use(errorHandler);

// Not Found Route Handler
app.use(notFound)

export default app;