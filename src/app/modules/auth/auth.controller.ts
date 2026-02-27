import { Request, Response } from "express";
import { asynchandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";
import { CookieUtils } from "../../utils/cookie";

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
});

const getMe = asynchandler(async(req: Request, res: Response) => {
    const user = req.user;
    const result = await authService.getMe(user);
    console.log(result);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'User profile fetched successfully',
        data: result
    })
})

const getNewToken = asynchandler(async(req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    
    if(!refreshToken) {
        throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
    }
    const result = await authService.getNewToken(refreshToken, betterAuthSessionToken);

     const { newAccessToken, refreshToken: newRefreshToken, sessionToken } = result;

        tokenUtils.setAccessTokenCookie(res, newAccessToken);
        tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "New tokens generated successfully",
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                sessionToken
            }
        })
})

const changePassword = asynchandler(async(req: Request, res: Response) => {
    const payload = req.body;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];

    const result = await authService.changePassword(payload, betterAuthSessionToken);

    const { accessToken, refreshToken, token } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password changed successfully",
        data: result
    })
})

const logoutUser = asynchandler(async(req: Request, res: Response) => {
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await authService.logoutUser(betterAuthSessionToken);
    CookieUtils.clearCookie(res, 'accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    CookieUtils.clearCookie(res, 'refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    CookieUtils.clearCookie(res, 'better-auth.session_token', {
        httpOnly: true,
        secure: true,
        sameSite: "none", 
    });

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User logged out successfully",
        data: result,
    })
})

const verifyEmail = asynchandler(async(req: Request, res: Response) => {
    const {email, otp} = req.body;
    await authService.verifyEmail(email, otp);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Email verified successfully"
    })
})

const forgotPassword = asynchandler(async(req: Request, res: Response) => {
    const {email} = req.body;
    const result = await authService.forgotPassword(email);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset OTP send to email successfully",
        data: result
    })
})

const resetPassword = asynchandler(async(req: Request, res: Response) => {
    const {email, otp, newPassword } = req.body;
    const result = await authService.resetPassword(email, otp, newPassword);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successfully",
        data: result
    })
})

const googleLogin = asynchandler(async(req: Request, res: Response) => {})

const googleLoginSuccess = asynchandler(async(req: Request, res: Response) => {})

const handleOAuthError = asynchandler(async(req: Request, res: Response) => {})

export const authController = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
    googleLogin,
    googleLoginSuccess,
    handleOAuthError
}