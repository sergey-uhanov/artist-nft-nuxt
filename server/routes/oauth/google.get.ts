export default defineOAuthGoogleEventHandler({
    config: {

    },
    async onSuccess(event, { user, tokens }) {

        await setUserSession(event, {
            user: {
                id: user.id,
                name: user.name,
            }
        })
        return sendRedirect(event, '/')
    },
    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.error('Google OAuth error:', error)
        return sendRedirect(event, '/')
    },
})