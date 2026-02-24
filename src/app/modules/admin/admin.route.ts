import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { updateAdminValidationSchema } from "./admin.validation";

const router = Router();

router.get('/',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.getAllAdmins
)

router.get('/:id', 
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.getAdminById
)

router.patch('/:id',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(updateAdminValidationSchema),
    adminController.updateAdmin
)

router.delete('/:id',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.softDeleteAdmin
)

export const adminRoutes = router;