import {prisma} from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const {user} = await getUserSession(event)
    if (!user?.id || !event.context.params) throw createError({statusCode: 401});

    const threadId = event.context.params.id;
    const body = await readBody(event);
    const {body: text, attachments} = body;

    const message = await prisma.message.create({
        data: {
            threadId,
            senderId: user.id,
            body: text,
            attachments,
        },
        include: {sender: {select: {name: true, img: true}}},
    });

    // Update thread updatedAt
    await prisma.thread.update({
        where: {id: threadId},
        data: {updatedAt: new Date()},
    });

    return message;
});