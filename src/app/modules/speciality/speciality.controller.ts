import { Request, Response } from "express";
import { asynchandler } from "../../utils/asyncHandler";
import { specialityService } from "./speciality.service";

const createSpeciality = asynchandler(async (req: Request, res: Response) => {

    const payload = req.body;
    const result = await specialityService.createSpeciality(payload);
    res.status(201).json({
        success: true,
        message: 'Speciality created successfully....',
        data: result
    })
   
});

const getAllSpecialities = asynchandler( async (req: Request, res: Response) => {
    const result = await specialityService.getAllSpecialities();
    res.status(200).json({
        success: true,
        message: "Fetched all specialities",
        data: result
    });
});

const deleteSpeciality = asynchandler( async(req: Request, res: Response) => {
    const { id } = req.params;
    const result = await specialityService.deleteSpeciality(id as string);
    res.status(200).json({
        success: true,
        message: "Your requested speciality deleted successfully..",
        data: result
    });
});

export const specialityController = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality
}