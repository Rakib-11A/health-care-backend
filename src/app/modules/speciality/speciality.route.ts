/* eslint-disable @typescript-eslint/no-explicit-any */
import { specialityController } from "./speciality.controller";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { Router } from "express";

const router = Router();

router.post('/', checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), specialityController.createSpeciality);
router.get('/',specialityController.getAllSpecialities);
router.patch('/:id',checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), specialityController.updateSpeciality);
router.delete('/:id', checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), specialityController.deleteSpeciality);

export const SpecialityRoutes = router;