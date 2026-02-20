import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { createDoctorSchema } from "./user.validation";

const router = Router();


router.post('/create-doctor', validateRequest(createDoctorSchema),userController.createDoctor);
// router.post('/create-admin', userController.createAdmin);
// router.post('/create-superadmin', userController.createSuperadmin)

export const userRoutes = router;