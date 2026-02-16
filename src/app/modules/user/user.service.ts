import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

const createDoctor = async(payload: ICreateDoctorPayload) => {
    const specialities: Speciality[] = [];
    for(const specialityId of payload.specialities) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specialityId
            }
        })
        if(!speciality){
            throw new Error(`Speciality with id ${specialityId} not found`)
        }
        specialities.push(speciality);
    }
}

export const doctorService = {
    createDoctor
}