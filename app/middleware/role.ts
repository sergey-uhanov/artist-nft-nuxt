import type {Role} from "~~/generated/prisma/enums";

export default defineNuxtRouteMiddleware(async (to) => {
    const session = useUserSession()

    const allowedRoles = to.meta.role as Role[]

    if (!session.user.value) return navigateTo('/')

    const userRole = session.user.value.role as Role

    if (!allowedRoles.includes(userRole)) {
        return navigateTo('/')
    }
})
