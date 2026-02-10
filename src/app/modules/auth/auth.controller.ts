import { Request, Response } from "express";
import { asynchandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const registerPatient = asynchandler( async(req: Request, res: Response) => {
    const payload = req.body;
    // console.log(payload)
    const result = await authService.registerPatient(payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Patient created successfully..',
        data: result
    });
});

const loginUser = asynchandler(async(req: Request, res: Response) => {
    const payload = req.body;
    const result = await authService.loginUser(payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Login successfull",
        data: result
    })
})

export const authController = {
    registerPatient,
    loginUser
}