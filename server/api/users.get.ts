import { prisma } from '~~/server/utils/db'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const limit = Math.min(Number(query.limit) || 20, 50)
    const cursor = typeof query.cursor === 'string' ? query.cursor : undefined
    const search = typeof query.search === 'string' ? query.search.trim() : undefined

    const users = await prisma.user.findMany({
        take: limit + 1,
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
        }),
        where: {
            ...(search && {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            }),
        },
        orderBy: {
            name: 'asc',
        },
        select: {
            id: true,
            name: true,
            email: true,
            img: true,
            createdAt: true,
        },
    })

    const hasNextPage = users.length > limit
    const items = hasNextPage ? users.slice(0, -1) : users
    const nextCursor = hasNextPage ? items.at(-1)?.id : null

    return {
        items,
        nextCursor,
        hasNextPage,
    }
})
