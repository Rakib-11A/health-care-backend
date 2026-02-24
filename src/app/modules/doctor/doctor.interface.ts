// export interface IUpdataDoctorPayload {
//     naem?: string;
//     profilePhoto?: string;
//     contactNumber?: string;
//     address?: string;
//     experience?: number
// }

import { Gender } from "../../../generated/prisma/enums";

export interface IUpdataDoctorPayload {
  name?: string;
  profilePhoto?: string;
  contactNumber?: string;
  registrationNumber?: string;
  experience?: number;
  gender?: Gender;
  appointmentFee?: number;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
  specialities?: string[]; // Array of specialty IDs to update
}