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
);

router.post(
    '/change-password',
    checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
    authController.changePassword
);

router.post(
    '/logout',
    checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
    authController.logoutUser
);

router.post(
    '/verify-email',
    authController.verifyEmail
)

router.post(
    '/forgot-password',
    authController.forgotPassword
)

router.post(
    '/reset-password',
    authController.resetPassword
)

router.get(
    '/login/google',
    authController.googleLogin
)

router.get(
    '/google/success', 
    authController.googleLoginSuccess
)

router.get(
    '/oauth/error',
    authController.handleOAuthError
)
export const AuthRoutes = router;