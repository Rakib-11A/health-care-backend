import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateAdmin } from "./admin.interface";

const getAllAdmins = async() => {
    return await prisma.admin.findMany({
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

const getAdminById = async( id: string ) => {
    const admin = await prisma.admin.findUnique({
        where: { id }
    });

    if(!admin || admin.isDeleted){
        throw new AppError(status.NOT_FOUND, 'Admin not found');
    }

    return admin;
}

const updateAdmin = async( id: string, payload: IUpdateAdmin) => {
    const adminExists = await prisma.admin.findUnique({
        where: { id }
    });

    if(!adminExists){
        throw new AppError(status.NOT_FOUND, "Admin with the id is not found.");
    }

    return await prisma.admin.update({
        where: { id },
        data: payload
    })
}

const softDeleteAdmin = async( id : string ) => {
    const adminExists = await prisma.admin.findUnique({
        where: { id }
    });

    if(!adminExists) {
        throw new AppError(status.NOT_FOUND, "Admin with the id is not found.");
    }

    return await prisma.admin.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    })
}
export const adminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    softDeleteAdmin
}