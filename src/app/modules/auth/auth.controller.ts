import { Request, Response } from "express";
import { asynchandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerPatient = asynchandler( async(req: Request, res: Response) => {
    const payload = req.body;
    // console.log(payload)
    const result = await authService.registerPatient(payload);
    const { token, accessToken, refreshToken, ...rest } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Patient created successfully..',
        data: {
            token,
            accessToken,
            refreshToken,
            ...rest
        }
    });
});

const loginUser = asynchandler(async(req: Request, res: Response) => {
    const payload = req.body;
    const result = await authService.loginUser(payload);
    const { token, accessToken, refreshToken, ...rest } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Login successfull",
        data: {
            token,
            accessToken,
            refreshToken,
            ...rest
        }
    })
})

export const authController = {
    registerPatient,
    loginUser
}