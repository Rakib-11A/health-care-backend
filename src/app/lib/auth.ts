import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { envVars } from "../config/env";



export const auth = betterAuth({
    baseURL: envVars.BETTER_AUTH_URL,
    secret: envVars.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true
    },
    socialProviders: {
        google: {
            clientId: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            // callbackUrl: envVars.GOOGLE_CALLBACK_URL,
            mapProfileToUser: () => {
                return {
                    role: UserRole.PATIENT,
                    status: UserStatus.ACTIVE,
                    needPasswordChange: false,
                    emailVerified: true,
                    isDeleted: false,
                    deletedAt: null
                }
            }
        }
    },

    plugins: [
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({email, otp, type}) {
                if(type === "email-verification"){
                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })

                    if(!user){
                        console.log(`User with email ${email} not found. Cannot send verification OTP`);
                        return;
                    }

                    if(user && user.role === UserRole.SUPER_ADMIN) {
                        console.log(`User with email ${email} is a super admin. Skipping sending verification OTP.`)
                        return;
                    }

                    if(user && !user.emailVerified) {
                        sendEmail({
                            to: email,
                            subject: "Verify your email",
                            templateName: 'otp',
                            templateData: {
                                name: user.name,
                                otp,
                            }
                        })
                    }
                }
                else if(type === "forget-password") {
                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })

                    if(user) {
                        sendEmail({
                            to: email,
                            subject: "Password Reset OTP",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp
                            }
                        })
                    }
                }
            },
            expiresIn: 2 * 60, // 2 minutes in second
            otpLength: 6,
        })
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: UserRole.PATIENT
            },
            status: {
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE
            },
            needPasswordChange: {
                type: "boolean",
                required: true,
                defaultValue: false
            },
            isDeleted: {
                type: "boolean",
                required: false,
                defaultValu: false
            },
            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null
            }
        }
    },
    session: {
        expiresIn: 60 * 60 * 60 * 24,
        updateAge: 60 * 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 60 * 24
        }
    },
    trustedOrigins: [
        envVars.BETTER_AUTH_URL,
        envVars.FRONTEND_URL,
        "http://localhost:5000",
        "http://localhost:3000"
    ],

    advanced: {
        // Allow OAuth callback when redirected from Google (cross-site navigation).
        // In production with HTTPS, you can set this to false and rely on SameSite=None; Secure.
        disableCSRFCheck: !envVars.BETTER_AUTH_URL.startsWith("https://"),
        useSecureCookies: envVars.BETTER_AUTH_URL.startsWith("https://"),
        defaultCookieAttributes: {
            sameSite: envVars.BETTER_AUTH_URL.startsWith("https://") ? "none" : "lax",
            secure: envVars.BETTER_AUTH_URL.startsWith("https://"),
            path: "/",
        },
        cookies: {
            state: {
                attributes: {
                    sameSite: envVars.BETTER_AUTH_URL.startsWith("https://") ? "none" : "lax",
                    secure: envVars.BETTER_AUTH_URL.startsWith("https://"),
                    httpOnly: true,
                    path: "/",
                }
            },
            sessionToken: {
                attributes: {
                    sameSite: envVars.BETTER_AUTH_URL.startsWith("https://") ? "none" : "lax",
                    secure: envVars.BETTER_AUTH_URL.startsWith("https://"),
                    httpOnly: true,
                    path: "/",
                }
            }
        }
    }
});