import {prisma} from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const { user } = await getUserSession(event)
    if (!user?.id) throw createError({ statusCode: 401 });

    const body = await readBody(event);
    const { recipientId, title } = body; // recipientId is the other user's ID

    const existing = await prisma.thread.findFirst({
        where: {
            members: {
                every: { userId: { in: [user.id, recipientId] } },
            },
        },
    });
    if (existing) return existing;


    const thread = await prisma.thread.create({
        data: {
            title: title || '',
            createdBy: user.id,
            members: {
                create: [
                    { userId: user.id },
                    { userId: recipientId },
                ],
            },
        },
    });
    return thread;
});