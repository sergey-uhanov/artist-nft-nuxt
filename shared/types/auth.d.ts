// shared/types/auth.d.ts
declare module '#auth-utils' {
    interface User {
        id: number,
        name: string,

    }

    interface UserSession {
        user: {
            id: number
            name: string,

        }
    }

    interface SecureSessionData {
        // Add your own fields
    }
}

export {}