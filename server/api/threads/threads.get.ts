import {prisma} from "~~/server/utils/db";


export default defineEventHandler(async (event) => {
    const {user} = await getUserSession(event)

    if (!user) throw createError({statusCode: 401});

    const threads = await prisma.thread.findMany({
        where: {
            members: {some: {userId: user.id}},
        },
        include: {
            members: {
                include: {user: true},
            },
            messages: {
                orderBy: {createdAt: 'desc'},
                take: 1,
            },
        },
        orderBy: {updatedAt: 'desc'},
    });


    return threads.map((thread) => {
        const otherMember = thread.members.filter((m) => m.userId !== user.id)
        return {
            id: thread.id,
            title: thread.title,
            otherUser: otherMember,
            lastMessage: thread.messages[0],
        };
    });
});