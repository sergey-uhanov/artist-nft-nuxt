import {regSchema} from "#shared/validation/registration.schema";
import {nanoid} from "nanoid";
import {sendVerificationEmail} from '@@/server/email/sendVerificationEmail'


export default defineEventHandler(async (event) => {

    const body = await readValidatedBody(event, regSchema.parse)

    const hashedPassword = await hashPassword(body.password)
    const params = getQuery(event)


    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: body.role,
        },
    })

    const token = nanoid(48);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    await prisma.verifyToken.create({
        data: {
            userId: user.id,
            token,
            expiresAt
        }
    });

    await sendVerificationEmail(body.email, token, params.locale);


    return {success: true}
})
