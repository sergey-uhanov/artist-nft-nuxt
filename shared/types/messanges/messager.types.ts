export interface UserDTO {
    id: string
    name: string
    img?: string | null
}

export interface MessageDTO {
    id: string
    body: string
    createdAt: string
    threadId: string
    sender: UserDTO
    threadTitle?: string,
}

export interface ThreadLastMessageDTO {
    body: string
    createdAt: string
    sender: UserDTO
}

export interface ThreadDTO {
    id: string
    title?: string | null
    img?: string | null
    unreadCount?: number
    lastMessage?: ThreadLastMessageDTO | null
    otherUser: {
        user: UserDTO
    }[]
}

export type WSClientMessage =
    | { type: "auth"; userId: string }
    | { type: "join"; threadId: string; name: string; senderId: string }
    | { type: "leave"; threadId: string }
    | { type: "message"; text: string }

export type WSServerMessage =
    | { type: "message"; payload: MessageDTO }
    | { type: "system"; text: string }
