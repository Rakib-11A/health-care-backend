import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { createAdminValidationSchema, createDoctorSchema, createSuperAdminValidationSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();


router.post('/create-doctor', validateRequest(createDoctorSchema),userController.createDoctor);

router.post('/create-admin',
    checkAuth(UserRole.SUPER_ADMIN),
    validateRequest(createAdminValidationSchema),
    userController.createAdmin
);

router.post('/create-super-admin',
    checkAuth(UserRole.SUPER_ADMIN),
    validateRequest(createSuperAdminValidationSchema),
    userController.createSuperAdmin
)

export const userRoutes = router;