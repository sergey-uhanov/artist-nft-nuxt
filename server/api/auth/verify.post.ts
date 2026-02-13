export default defineEventHandler(async (event) => {
    const {token} = await readBody(event);
    console.log('token', token);
    if (typeof token !== 'string') {
        throw createError({
            status: 400,
            message: 'invalid token',
            data: {code: 'INVALID_TOKEN'}
        })
    }

    const record = await prisma.verifyToken.findUnique({
        where: {token},
        include: {user: true}
    });

    if (!record || record.expiresAt < new Date()) {
        console.log('record',record);
        if (!record) {
            throw createError(
                {
                    status: 400,
                    statusMessage: 'Invalid or expired token',
                    data: {code: 'EXPIRED_TOKEN1'}
                });
        }

        await prisma.user.delete({
            where: {id: record.userId},
        });
        throw createError(
            {
                status: 400,
                statusMessage: 'Invalid or expired token',
                data: {code: 'EXPIRED_TOKEN2'}
            });
    }

    await prisma.user.update({
        where: {id: record.userId},
        data: {emailVerified: true}
    });

    await prisma.verifyToken.delete({where: {id: record.id}});

    return {success: true};
});
