import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.patch('/:id', validateRequest(updateDoctorZodSchema), doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);

export const doctorRoutes = router;