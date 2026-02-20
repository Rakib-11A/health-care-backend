import status from "http-status"
import AppError from "../../errorHelpers/AppError"
import { prisma } from "../../lib/prisma"
import { IUpdataDoctorPayload } from "./doctor.interface"

const getAllDoctors = async() => {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: true,
            specialities: {
                include: {
                    speciality: true
                }
            }
        }
    })
    return doctors
}

const getDoctorById = async( id: string ) => {
    const doctor = await prisma.doctor.findUnique({
        where: { id }
    })
    return doctor;
}

const updateDoctor = async( id: string, payload: IUpdataDoctorPayload ) => {
    const doctorExists = await prisma.doctor.findUnique({
        where: { id }
    });

    if(!doctorExists) {
        throw new AppError(status.NOT_FOUND, `Doctor not found along with the id : ${id}`)
    }

    const doctor = await prisma.doctor.update({
        where: { id },
        data: {
            ...payload
        }
    })

    return doctor
}

const deleteDoctor = async(id : string) => {
    const doctor = await prisma.doctor.update({
        where: { id },
        data: {
            isDeleted: true
        }
    })
    return doctor;
}

export const doctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}