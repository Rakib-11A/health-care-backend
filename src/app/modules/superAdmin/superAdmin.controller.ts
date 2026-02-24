import { Request, Response } from "express";
import { asynchandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { superAdminService } from "./superAdmin.service";

const getAllSuperAdmins = asynchandler(async(req: Request, res: Response) => {
    const result = await superAdminService.getAllSuperAdmins();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Fetch all admins",
        data: result
    })
});

const getSuperAdminById = asynchandler( async(req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await superAdminService.getSuperAdminById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Fetch admin by the provided ID",
        data: result
    })
})

const updateSuperAdmin = asynchandler(async(req: Request, res: Response) => {
    const id = req.params.id as string;
    const payload = req.body;
    const result = await superAdminService.updateSuperAdmin(id, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Amdin updated successfully",
        data: result
    })
});

const softDeleteSuperAdmin = asynchandler(async(req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await superAdminService.softDeleteSuperAdmin(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Admin softly deleted.',
        data: result
    })
})
export const superAdminController = {
    getAllSuperAdmins,
    getSuperAdminById,
    updateSuperAdmin,
    softDeleteSuperAdmin
}