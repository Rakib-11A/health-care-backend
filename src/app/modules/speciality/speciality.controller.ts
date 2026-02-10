import { Request, Response } from "express";
import { asynchandler } from "../../utils/asyncHandler";
import { specialityService } from "./speciality.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createSpeciality = asynchandler(async (req: Request, res: Response) => {

    const payload = req.body;
    const result = await specialityService.createSpeciality(payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Speciality created successfully...',
        data: result
    })
   
});

const getAllSpecialities = asynchandler( async (req: Request, res: Response) => {
    const result = await specialityService.getAllSpecialities();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Fetch all specialities',
        data: result
    })
});

const deleteSpeciality = asynchandler( async(req: Request, res: Response) => {
    const { id } = req.params;
    const result = await specialityService.deleteSpeciality(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Speciality deleted successfully',
        data: result
    })
});

const updateSpeciality = asynchandler( async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await specialityService.updateSpeciality(id as string, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Speciality created successfully...',
        data: result
    })
});

export const specialityController = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality
}