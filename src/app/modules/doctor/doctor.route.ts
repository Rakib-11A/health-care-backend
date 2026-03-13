import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { updateDoctorValidationSchema } from "./doctor.validation";

const router = Router();

router.get('/',
    // checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    doctorController.getAllDoctors
);

router.get(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    doctorController.getDoctorById
);
router.patch(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(updateDoctorValidationSchema),
    doctorController.updateDoctor
);

router.delete(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    doctorController.deleteDoctor
);

export const doctorRoutes = router;