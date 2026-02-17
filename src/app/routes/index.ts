import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";
import { doctorRoutes } from "../modules/doctor/doctor.route";
const router = Router();

router.use('/auth', AuthRoutes);
router.use('/specialities', SpecialityRoutes);
router.use('/users', userRoutes);
router.use('/doctors', doctorRoutes);

export const IndexRoutes = router;