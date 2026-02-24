import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateSuperAdmin } from "./superAdmin.inteface";

const getAllSuperAdmins = async() => {
    return await prisma.superAdmin.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true
                }
            }
        }
    });
}

const getSuperAdminById = async( id: string ) => {
    const superAdmin = await prisma.superAdmin.findUnique({
        where: { id }
    });

    if(!superAdmin || superAdmin.isDeleted){
        throw new AppError(status.NOT_FOUND, 'superAdmin not found');
    }

    return superAdmin;
}

const updateSuperAdmin = async( id: string, payload: IUpdateSuperAdmin) => {
    const superAdminExists = await prisma.superAdmin.findUnique({
        where: { id }
    });

    if(!superAdminExists){
        throw new AppError(status.NOT_FOUND, "superAdmin with the id is not found.");
    }

    return await prisma.superAdmin.update({
        where: { id },
        data: payload
    })
}

const softDeleteSuperAdmin = async( id : string ) => {
    const superAdminExists = await prisma.superAdmin.findUnique({
        where: { id }
    });

    if(!superAdminExists) {
        throw new AppError(status.NOT_FOUND, "superAdmin with the id is not found.");
    }

    return await prisma.superAdmin.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    })
}
export const superAdminService = {
    getAllSuperAdmins,
    getSuperAdminById,
    updateSuperAdmin,
    softDeleteSuperAdmin
}