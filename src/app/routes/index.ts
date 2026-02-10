import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.route";
import { AuthRoutes } from "../modules/auth/auth.route";
const router = Router();

router.use('/auth', AuthRoutes);
router.use('/specialities', SpecialityRoutes);

export const IndexRoutes = router;