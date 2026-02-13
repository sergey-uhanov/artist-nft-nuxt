export default defineWebSocketHandler({

    async message(peer, raw) {
        const json = JSON.parse(raw.text());

        // --- AUTH ---
        if (json.type === 'auth') {
            peer.context.userId = json.userId;
            peer.subscribe(`user:${json.userId}`); // ключевая строка
            return;
        }

        // --- JOIN CHAT ---
        if (json.type === 'join') {
            const {threadId, name, senderId} = json;

            peer.context.userName = name;
            peer.context.threadId = threadId;
            peer.context.senderId = senderId;

            peer.subscribe(`thread:${threadId}`);
            return;
        }

        // --- MESSAGE ---
        if (json.type === 'message') {

            const newMessage = await prisma.message.create({
                data: {
                    threadId: <string>peer.context.threadId,
                    senderId: <string>peer.context.senderId,
                    body: json.text,
                },
                include: {
                    sender: {select: {id: true, name: true, img: true}},
                    thread: {
                        include: { members: true }
                    }
                }
            });

            const payload = JSON.stringify({
                type: 'message',
                payload: newMessage
            });

            // 1. тем кто открыт в чате
            peer.publish(`thread:${peer.context.threadId}`, payload);

            // 2. персонально каждому участнику
            for (const member of newMessage.thread.members) {
                if (member.userId !== peer.context.senderId) {
                    peer.publish(`user:${member.userId}`, payload);
                }
            }

            // отправителю
            peer.send(payload);
        }
    }
});
