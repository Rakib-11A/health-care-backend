import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateAdmin } from "./admin.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { UserStatus } from "../../../generated/prisma/enums";

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
        throw new AppError(status.NOT_FOUND, "Admin or Super-Admin not found.");
    }

    return await prisma.admin.update({
        where: { id },
        data: payload
    })
}

const softDeleteAdmin = async( id : string, user: IRequestUser) => {
    const isAdminExists = await prisma.admin.findUnique({
        where: { id }
    });

    if(!isAdminExists) {
        throw new AppError(status.NOT_FOUND, "Admin or Super-admin not found.");
    }

   if(isAdminExists.id === user.userId) {
    throw new AppError(status.BAD_REQUEST, "You cannot delete yourself.");
   }

   const result = await prisma.$transaction(async(tx) => {
    await tx.admin.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    await tx.user.update({
        where: { id: isAdminExists.userId },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
            status: UserStatus.DELETED
        },
    })

    await tx.session.deleteMany({
        where: {
            userId: isAdminExists.userId
        }
    })

    await tx.account.deleteMany({
        where: {
            userId: isAdminExists.userId
        }
    })
    
    const admin = await getAdminById(id);

    return admin;
   });

   return result;
}
export const adminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    softDeleteAdmin
}