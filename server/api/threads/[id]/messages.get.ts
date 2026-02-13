import {prisma} from "~~/server/utils/db";


export default defineEventHandler(async (event) => {
    const { user } = await getUserSession(event)
    if (!user?.id) throw createError({ statusCode: 401 });

    const threadId = event.context.params?.id;
    if (!threadId) throw createError({ statusCode: 401 });

    const isMember = await prisma.threadMember.findUnique({
        where: { threadId_userId: { threadId, userId: user.id } },
    });
    if (!isMember) throw createError({ statusCode: 403 });

    const messages = await prisma.message.findMany({
        where: { threadId },
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { name: true, img: true } } },
    });

    // Update readAt for the user
    await prisma.threadMember.update({
        where: { threadId_userId: { threadId, userId: user.id } },
        data: { readAt: new Date() },
    });

    return messages;
});