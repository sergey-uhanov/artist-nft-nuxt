export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true
    },
    async onSuccess(event, {user}) {
        console.log(user);


        const userLocal = await prisma.user.findUnique({
            where: {
                email: user.email!
            }
        })

        if (!userLocal) {
            await prisma.user.create({
                data: {
                    email: user.email!,
                    name: user.login,
                    emailVerified: true,
                    img: user.avatar_url,
                    role: 'CUSTOMER'
                }
            })
        }

        await setUserSession(event, {
            user: {
                id: userLocal ? userLocal.id : user.id,
                name: userLocal ? userLocal.name : user.login,
                role: userLocal ? userLocal.role : 'CUSTOMER',
                img: userLocal ? userLocal.img : user.avatar_url
            }
        })
        return sendRedirect(event, '/')
    },
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/')
    },
})