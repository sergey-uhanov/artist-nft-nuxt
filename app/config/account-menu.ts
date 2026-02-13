import type {Role} from '~~/generated/prisma/enums'

type MenuItem = {
    label: string
    to: string
    icon: string
    activeIcon: string
}

type AccountMenuOptions = Record<Role, MenuItem[]>

export const accountMenuRecord: AccountMenuOptions = {
    CUSTOMER: [
        {label: 'messages', to: '/messages', icon: 'message', activeIcon: 'message_active'},
        {label: 'orders', to: '/personal-account/customer/orders', icon: 'order', activeIcon: 'orderActive'}
    ],
    ADMIN: [
        {label: 'messages', to: '/messages', icon: 'message', activeIcon: 'message_active'},
        {label: 'orders', to: '/personal-account/admin/orders', icon: 'order', activeIcon: 'orderActive'},
        {label: 'nfrOrders', to: '/personal-account/admin/orders-nft', icon: 'nftorder', activeIcon: 'nftorderActive'},
        {label: 'workers', to: '/personal-account/admin/workers', icon: 'order', activeIcon: 'orderActive'},

    ],
    ARTIST: [
        {label: 'messages', to: '/messages', icon: 'message', activeIcon: 'message_active'},
        {label: 'statistics', to: '/personal-account/artist/statistics', icon: 'order', activeIcon: 'orderActive'},
    ],
}
