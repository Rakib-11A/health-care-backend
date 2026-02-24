/*
model Doctor {
    id                  String   @id @default(uuid())
    name                String
    email               String   @unique
    profilePhoto        String
    contactNumber       String
    address             String
    registrationNumber  String
    experience          Int
    gender              Gender
    appoinmentFee       Float    @default(0.0)
    qualification       String
    currentWorkingPlace String
    designation         String
    averageRating       Float    @default(0.0)
}

 */

import { Gender } from "../../../generated/prisma/enums";

export interface ICreateDoctorPayload {
    password: string;
    doctor: {
        name: string;
        email: string;
        profilePhoto: string;
        contactNumber: string;
        address: string;
        registrationNumber: string;
        experience: number;
        gender: Gender;
        appoinmentFee: number;
        qualification: string;
        currentWorkingPlace: string;
        designation: string;
    };
    specialities: string[];
}

export interface ICreateAdmin {
    password: string;
    admin: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber: string;
    }
}

export interface ICreateSuperAdmin {
    password: string;
    superAdmin: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber: string;
    }
}