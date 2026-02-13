export default defineOAuthGoogleEventHandler({

    async onSuccess(event, { user}) {


        const userLocal = await prisma.user.findUnique({
            where:{
                email: user.email
            }
        })



        if(!userLocal){
            await prisma.user.create({
                data:{
                    email: user.email,
                    name: user.name,
                    emailVerified: true,
                    img: user.picture,
                    role: 'CUSTOMER'
                }
            })
        }

        await setUserSession(event, {
            user: {
                id: userLocal ? userLocal.id : user.id,
                name: userLocal ?  userLocal.name: user.name,
                role: userLocal ? userLocal.role : 'CUSTOMER',
                img: userLocal ? userLocal.img : user.picture
            }
        })
        return sendRedirect(event, '/')
    },

    onError(event, error) {
        console.error('Google OAuth error:', error)
        return sendRedirect(event, '/')
    },
})