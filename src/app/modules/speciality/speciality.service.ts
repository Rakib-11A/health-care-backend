import status from "http-status";
import { Speciality } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payload : Speciality) : Promise<Speciality> => {
    const speciality = await prisma.speciality.create({
        data: payload
    });
    return speciality;
};

const getAllSpecialities = async() : Promise<Speciality[]> => {
    const specialities = await prisma.speciality.findMany({
        where: {
            isDeleted: false
        }
    });
    return specialities;
}
const updateSpeciality = async (id : string, payload : Partial<Speciality>) : Promise<Speciality> => {
    // Check the record is exist in the DB
    const isExists = await prisma.speciality.findUnique({
        where: { id },
    });
    if(!isExists) {
        throw new AppError(status.NOT_FOUND, "Speciality not found or alrady deleted!");
    }
    const speciality = await prisma.speciality.update({
        where: { id },
        data: payload
    });

    return speciality;
}

const deleteSpeciality = async (id: string): Promise<Speciality> => {
    /* Soft Deletiion */
    // const deletedSpeciality = await prisma.speciality.update({
    //     where: { id },
    //     data: {
    //         isDeleted: true,
    //         DeletedAt: new Date()
    //     },
    // });
    const deletedSpeciality = await prisma.speciality.delete({
        where: { id }
    });
    return deletedSpeciality;
}

export const specialityService = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality
}