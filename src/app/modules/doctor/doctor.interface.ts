// export interface IUpdataDoctorPayload {
//     naem?: string;
//     profilePhoto?: string;
//     contactNumber?: string;
//     address?: string;
//     experience?: number
// }

import { Gender } from "../../../generated/prisma/enums";

export interface IUpdateDoctorSpecialityPayload {
  specialityId: string;
  shouldDelete?: boolean;
}
export interface IUpdataDoctorPayload {
  doctor?: {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    experience?: number;
    registrationNumber?: string;
    gender?: Gender;
    appointmentFee?: number;
    qualification?: string;
    currentWorkingPlace?: string;
    designation?: string;
  }
  specialities?: IUpdateDoctorSpecialityPayload[]; // Array of specialty IDs to update
}