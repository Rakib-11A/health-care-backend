/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { Speciality, UserRole } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateAdmin, ICreateDoctorPayload, ICreateSuperAdmin } from "./user.interface";

const createDoctor = async(payload: ICreateDoctorPayload) => {
    const specialities: Speciality[] = [];
    for(const specialityId of payload.specialities) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specialityId
            }
        })
        if(!speciality){
            throw new AppError(status.NOT_FOUND, `Speciality with id ${specialityId} not found`)
        }
        specialities.push(speciality);
    }

    const userExists = await prisma.user.findUnique({
        where: { 
            email: payload.doctor.email
        }
    })

    if(userExists) {
        throw new AppError(status.CONFLICT, "User with this email already exists")
    }

    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.doctor.email,
            password: payload.password,
            role: UserRole.DOCTOR,
            name: payload.doctor.name,
            needPasswordChange: true
        }
    })

    try{
        const result = await prisma.$transaction( async(tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    ... payload.doctor,
                }
            })
            const doctorSpecialityData = specialities.map((speciality) => {
                return {
                    doctorId: doctorData.id,
                    specialityId: speciality.id
                }
            })

            await tx.doctorSpaciality.createMany({
                data: doctorSpecialityData
            })

            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData.id
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appoinmentFee: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            image: true,
                            isDeleted: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    },

                    specialities: {
                        select: {
                            speciality: {
                                select: {
                                    id: true,
                                    title: true
                                }
                            }
                        }
                    }
                }
            })
            return doctor;
        })
        return result;

    }catch(error){
        console.log("Transaction Error : ", error);
        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        })
        throw error;
    }
}


const createAdmin = async (payload: ICreateAdmin) => {
    // Step 1: check if user already exists
    const userExists = await prisma.user.findUnique({
        where: {
            email: payload.admin.email,
        },
    });

    if(userExists) {
        throw new AppError(status.CONFLICT, "User with this email already exists");
    }

    // Step 2: Create user according with Better Auth
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.admin.email,
            password: payload.password,
            role: UserRole.ADMIN,
            name: payload.admin.name,
            needPasswordChange: true,
            rememberMe: false
        }
    });

    // Step 3: Create admin profile in transaction
    try{
        const result = await prisma.$transaction(async(tx) => {
            // Create admin record
            const admin = await tx.admin.create({
                data: {
                    userId: userData.user.id,
                    name: payload.admin.name,
                    email: payload.admin.email,
                    profilePhoto: payload.admin.profilePhoto,
                    contactNumber: payload.admin.contactNumber
                }
            });

            // Fetch created admin with user data
            const createAdmin = await tx.admin.findUnique({
                where: { id: admin.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            status: true
                        }
                    }
                }
            });

            return createAdmin;
        })
        return result;
    }catch(error: any){
        await prisma.user.delete({
            where: {
                id: userData.user.id
            },
        });
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create admin", error);
    }
};

const createSuperAdmin = async (payload: ICreateSuperAdmin) => {
    // Step 1: Check if the user already exists
    const userExists = await prisma.user.findUnique({
        where: {
            email: payload.superAdmin.email
        },
    });

    if(userExists) {
        throw new AppError(status.CONFLICT, "User with this email already exists.");
    }

    // Step 2: Create user according to Better-Auth
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.superAdmin.email,
            password: UserRole.SUPER_ADMIN,
            name: payload.superAdmin.name,
            needPasswordChange: true,
            rememberMe: false
        }
    });

    // Step 3: Create super-admin profile in transaction
    try{
        const result = await prisma.$transaction(async(tx) => {
            // Create super-admin recored
            const superAdmin = await tx.superAdmin.create({
                data: {
                    userId: userData.user.id,
                    name: payload.superAdmin.name,
                    email: payload.superAdmin.email,
                    profilePhoto: payload.superAdmin.profilePhoto,
                    contactNumber: payload.superAdmin.contactNumber
                }
            });

            // Fetch created admin with user data
            const createSuperAdmin = await tx.superAdmin.findUnique({
               where: {
                id: superAdmin.id
               },
               select: {
                id: true,
                name: true,
                email: true,
                profilePhoto: true,
                contactNumber: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        status: true
                    }
                }
               }
            });
            return createSuperAdmin;
        })
        return result;
    }catch(error: any){
        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        });

        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create super-admin", error)
    }
}

export const userService = {
    createDoctor,
    createAdmin,
    createSuperAdmin
}