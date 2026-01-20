import {z} from 'zod/v4'
import {regSchema} from "#shared/validation/registration.schema";

const registerSchema = z.object({
    email: z.email('Invalid email'),
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default defineEventHandler(async (event) => {

    const body = await readValidatedBody(event, regSchema.parse)

    const hashedPassword = await hashPassword(body.password)


    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: body.role,
        },
    })


    await setUserSession(event,{
        user:{
            id: user.id,
            name: user.name
        },
        lastLoggedIn: new Date(),
    })

    return {success: true}
})
