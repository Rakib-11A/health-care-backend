import status from "http-status"
import AppError from "../../errorHelpers/AppError"
import { prisma } from "../../lib/prisma"
import { IUpdataDoctorPayload } from "./doctor.interface"

const getAllDoctors = async() => {
    // Fetch all non-deleted doctors
    const result = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            contactNumber: true,
            registrationNumber: true,
            experience: true,
            gender: true,
            appoinmentFee: true,
            qualification: true,
            currentWorkingPlace: true,
            designation: true,
            averageRating: true,
            createdAt: true,
            updatedAt: true,
            specialities: {
                select: {
                    speciality: {
                        select: {
                            id: true,
                            title: true
                        },
                    },
                },
            },
        },
    });

    // Transform specialites (flatten structure)
    const doctors = result.map((doctor) => ({
        ...doctor,
        specialities: doctor.specialities.map((s) => s.speciality),
    }));
    return doctors;
}

const getDoctorById = async( id: string ) => {
    const doctor = await prisma.doctor.findUnique({
        where: { id }
    })
    return doctor;
}

// const updateDoctor = async( id: string, payload: IUpdataDoctorPayload ) => {
//     const doctorExists = await prisma.doctor.findUnique({
//         where: { id }
//     });

//     if(!doctorExists) {
//         throw new AppError(status.NOT_FOUND, `Doctor not found along with the id : ${id}`)
//     }

//     const doctor = await prisma.doctor.update({
//         where: { id },
//         data: {
//             ...payload
//         }
//     })

//     return doctor
// }

const updateDoctor = async (id: string, payload: IUpdataDoctorPayload) => {
  // Check if doctor exists and not deleted
  const existingDoctor = await prisma.doctor.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existingDoctor) {
    throw new AppError(status.NOT_FOUND,"Doctor not found");
  }

  // Separate specialities from doctor data
  const { specialities, ...doctorData } = payload;

  // Update doctor basic information
  const updatedDoctor = await prisma.doctor.update({
    where: { id },
    data: doctorData,
    include: {
      specialities: {
        include: {
          speciality: true,
        },
      },
    },
  });

  // If specialities are provided, update them separately
  if (specialities && specialities.length > 0) {
    // Delete old specialities
    await prisma.doctorSpaciality.deleteMany({
      where: { doctorId: id },
    });

    // Add new specialities
    const specialitiesData = specialities.map((specialityId) => ({
      doctorId: id,
      specialityId,
    }));

    await prisma.doctorSpaciality.createMany({
      data: specialitiesData,
    });

    // Fetch updated doctor with new specialities
    const result = await prisma.doctor.findUnique({
      where: { id },
      include: {
        specialities: {
          include: {
            speciality: true,
          },
        },
      },
    });

    return {
      ...result,
      specialities: result?.specialities.map((s) => s.speciality) || [],
    };
  }

  // Return updated doctor with transformed specialities
  return {
    ...updatedDoctor,
    specialities: updatedDoctor.specialities.map((s) => s.speciality),
  };
};


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