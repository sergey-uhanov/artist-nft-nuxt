import type {Role} from '~~/generated/prisma/enums'

declare module '#auth-utils' {


    interface User {
        id: uuid
        name: string
        role: Role
        img: string | null
    }

    interface UserSession {
        user: User
    }

    interface SecureSessionData {
        // Add your own fields
    }
}

export {}