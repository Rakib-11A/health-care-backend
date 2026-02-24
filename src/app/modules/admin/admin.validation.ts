import z from "zod";

export const updateAdminValidationSchema = z.object({
    name: z.string().min(1),
    profilePhoto: z.url(),
    contactNumber: z.string()
}).partial();