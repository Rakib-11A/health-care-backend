import { Request, Response } from "express";
import { asynchandler } from "../../utils/asyncHandler";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createDoctor = asynchandler(async(req: Request, res: Response) => {
    const payload = req.body;
    const result = await userService.createDoctor(payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Doctor registered successfully",
        data: result
    })
})

const createAdmin = asynchandler( async(req: Request, res: Response) => {
    const payload = req.body;
    const result = await userService.createAdmin(payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Admin created successfully",
        data: result
    });
});

const createSuperAdmin = asynchandler(async(req: Request, res: Response) => {
    const payload = req.body;
    const result = await userService.createSuperAdmin(payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Super Admin created successfully",
        data: result,
    })
})

export const userController = {
    createDoctor,
    createAdmin,
    createSuperAdmin
}