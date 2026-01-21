export default defineEventHandler(async (event) => {
    const { token } = getQuery(event);

    if (typeof token !== 'string') {
        throw createError({
            status: 400,
            message: 'invalid token',
        })
    }

    const record = await prisma.verifyToken.findUnique({
        where: { token },
        include: { user: true }
    });

    if (!record || record.expiresAt < new Date()) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid or expired token' });
    }

    await prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true }
    });

    await prisma.verifyToken.delete({ where: { id: record.id } });

    return { success: true };
});
