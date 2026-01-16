import {z} from 'zod'
import type { ZodError } from 'zod'

export function parseZodErrors(
    error: ZodError,
): Record<string, string> {
    const result: Record<string, string> = {}

    for (const issue of error.issues) {
        const field = issue.path[0] as string
        if (!field) continue

        if (!result[field]) {
            result[field] = issue.message
        }
    }

    return result
}


export const loginSchema = z.object({
    email: z
        .email('errors.email.invalid'),

    password: z
        .string(
            'errors.password.type'
        )
        .min(8, 'errors.password.min')
        .regex(/[A-Z]/, 'errors.password.uppercase')
        .regex(/[0-9]/, 'errors.password.number'),
})

export type LoginForm = z.infer<typeof loginSchema>
