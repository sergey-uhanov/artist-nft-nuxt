import {z} from 'zod'
import {Role} from "~~/generated/prisma/enums";



export const regSchema = z.object({
    email: z
        .email('errors.email.invalid'),
    name: z.string().min(1, 'errors.name.required').max(256, 'errors.name.to-long'),
    role: z.enum(Role),
    password: z
        .string(
            'errors.password.type'
        )
        .min(8, 'errors.password.min')
        .regex(/[A-Z]/, 'errors.password.uppercase')
        .regex(/[0-9]/, 'errors.password.number'),
})

export type RegForm = z.infer<typeof regSchema>
