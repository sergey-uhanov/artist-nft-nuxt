import {defineStore} from 'pinia'

export type ToastType = 'success' | 'warning' | 'error'

export interface Toast {
    id: number
    message: string
    type: ToastType
    duration: number
}

export const useToastStore = defineStore('toast', {
    state: () => ({
        toasts: ref<Toast[]>([])
    }),
    actions: {
        show(message: string, type: ToastType = 'success', duration = 3000) {
            console.log('work')
            const id = Date.now() + Math.random()
            this.toasts.push({id, message, type, duration})
            console.log(this.toasts)
            setTimeout(() => this.remove(id), duration)
        },
        remove(id: number) {
            this.toasts = this.toasts.filter(t => t.id !== id)
        },
    },
})
