import z from "zod";

export const updateSuperAdminValidationSchema = z.object({
    name: z.string().min(1),
    profilePhoto: z.url(),
    contactNumber: z.string()
}).partial();