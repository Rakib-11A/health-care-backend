import { speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payload : speciality) : Promise<speciality> => {
    const speciality = await prisma.speciality.create({
        data: payload
    });
    return speciality;
};

const getAllSpecialities = async() : Promise<speciality[]> => {
    const specialities = await prisma.speciality.findMany({
        where: {
            isDeleted: false
        }
    });
    return specialities;
}
const updateSpeciality = async (id : string, payload : Partial<speciality>) : Promise<speciality> => {
    // Check the record is exist in the DB
    const isExists = await prisma.speciality.findUnique({
        where: { id },
    });
    if(!isExists) {
        throw new Error("Speciality not found or alrady deleted!");
    }
    const speciality = await prisma.speciality.update({
        where: { id },
        data: payload
    });

    return speciality;
}

const deleteSpeciality = async (id: string): Promise<speciality> => {
    /* Soft Deletiion */
    // const deletedSpeciality = await prisma.speciality.update({
    //     where: { id },
    //     data: {
    //         isDeleted: true,
    //         DeletedAt: new Date()
    //     },
    // });
    const specality = await prisma.speciality.delete({
        where: { id }
    });
    return specality;
}

export const specialityService = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality
}