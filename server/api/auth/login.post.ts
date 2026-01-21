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
            data: { code: 'AUTH_USER_NOT_FOUND' }
        })
    }

    const result = await verifyPassword(user.password, body.password)
    if (!result) {
        throw createError({
            status: 401,
            message: 'invalid password',
            data: { code: 'AUTH_USER_NOT_FOUND' }
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
