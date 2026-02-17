import { Request, Response } from "express";
import { asynchandler } from "../../utils/asyncHandler";
import { doctorService } from "./doctor.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getAllDoctors = asynchandler( async(req: Request, res: Response) => {
    const result = await doctorService.getAllDoctors();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'All doctors fetched successfully.',
        data: result
    })
})

const getDoctorById = asynchandler(async(req: Request, res: Response) => {
    const id = req.params.id as string
    const result = await doctorService.getDoctorById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Found doctor by id.',
        data: result
    })
})

const updateDoctor = asynchandler( async(req: Request, res: Response) => {
    const payload = req.body;
    const id = req.params.id as string;
    const result = await doctorService.updateDoctor(id, payload);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: false,
        message: 'Doctor updated successfully.',
        data: result
    });
})

const deleteDoctor = asynchandler( async( req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await doctorService.deleteDoctor(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Soft delete the doctor',
        data: result
    })
})
export const doctorController = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}