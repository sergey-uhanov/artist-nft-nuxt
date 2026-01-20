import {loginSchema} from "@@/shared/validation/auth.schema"





export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, loginSchema.parse)

    const user = await prisma.user.findUnique({
        where:{
            email: body.email,
        }
    })
    if (!user) {
        throw createError({
            status: 401,
            message: 'Unauthorized',
        })
    }

    const result = await verifyPassword(user.passwordHash, body.password)
    if (!result) {
        throw createError({
            status: 401,
            message: 'invalid password',
        })
    }
    await setUserSession(event, {
        user: {
            id: user.id,
            name: user.name,
        }
    })

    return {success: true}
})
