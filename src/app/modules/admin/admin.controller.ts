import { Request, Response } from "express";
import { asynchandler } from "../../utils/asyncHandler";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getAllAdmins = asynchandler(async(req: Request, res: Response) => {
    const result = await adminService.getAllAdmins();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Fetch all admins",
        data: result
    })
});

const getAdminById = asynchandler( async(req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await adminService.getAdminById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Fetch admin by the provided ID",
        data: result
    })
})

const updateAdmin = asynchandler(async(req: Request, res: Response) => {
    const id = req.params.id as string;
    const payload = req.body;
    const result = await adminService.updateAdmin(id, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Amdin updated successfully",
        data: result
    })
});

const softDeleteAdmin = asynchandler(async(req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await adminService.softDeleteAdmin(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Admin softly deleted.',
        data: result
    })
})
export const adminController = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    softDeleteAdmin
}