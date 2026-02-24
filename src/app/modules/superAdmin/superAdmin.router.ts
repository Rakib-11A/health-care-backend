import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { updateSuperAdminValidationSchema } from "./superAdmin.validation";
import { superAdminController } from "./superAdmin.controller";

const router = Router();

router.get('/',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    superAdminController.getAllSuperAdmins
)

router.get('/:id', 
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    superAdminController.getSuperAdminById
)

router.patch('/:id',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(updateSuperAdminValidationSchema),
    superAdminController.updateSuperAdmin
)

router.delete('/:id',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    superAdminController.softDeleteSuperAdmin
)

export const superAdminRoutes = router;