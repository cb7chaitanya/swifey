import * as z from 'zod'

export const profileCreationSchema = z.object({
    name: z.string(),
    DOB: z.date(),
    gender: z.string(), //TODO: USE A ENUM MAYBE
    college: z.string(),
    currentlyWorking: z.object({
        currentEmployment: z.string(),
        role: z.string()
    }),
    password: z.string().min(8),
    walletAddress: z.string()
})

export type ProfileCreation = z.infer<typeof profileCreationSchema>

export const signInSchema = z.object({
    walletAddress: z.string(),
    password: z.string().min(8)
})

export type Signin = z.infer<typeof signInSchema>

export const reclaimVerificationSchema = z.object({
    verified: z.boolean()
})

export type Verifiication = z.infer<typeof reclaimVerificationSchema>