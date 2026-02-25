import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post('/register', authController.registerPatient);
router.post('/login', authController.loginUser);
router.get(
    '/me',
    checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
    authController.getMe
);

router.post(
    '/refresh-token',
    authController.getNewToken
)

export const AuthRoutes = router;