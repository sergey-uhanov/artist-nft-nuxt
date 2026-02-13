<script lang="ts" setup>
import type {MessageDTO, ThreadDTO, WSServerMessage} from "#shared/types/messanges/messager.types";
import {useThemeStore} from "~/stores/theme";
import Modal from "~/components/ui/modal/Modal.vue";
import NewChat from "~/components/ui/modal/NewChat.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import BaseTextInput from "~/components/ui/BaseTextInput.vue";

definePageMeta({
  layout: 'personal-account',
  middleware: ['auth']
})

const {user} = useUserSession();
const threads = ref<ThreadDTO[]>([]);
const selectedThread = ref<ThreadDTO | null>(null);
const messages = ref<MessageDTO[]>([])
const messageInput = ref('');
const themeStore = useThemeStore()
const isOpenModalNewChat = ref(false);
const toastStore = useToastStore()
let audio: HTMLAudioElement | null = null
const chatRef = ref<HTMLElement | null>(null)

async function fetchingData() {
  const threadData = await $fetch<ThreadDTO[]>('/api/threads/threads');
  threads.value = threadData ?? []
}

// WebSocket: открываем один раз, подписываемся на персональный канал (auth)
// при переключении треда — отправляем leave/join
const {data, send, open} = useWebSocket<string>(`ws://${location.host}/api/threads/websocket`, {
  immediate: false,
  autoReconnect: true,
});

// connect один раз и авторизуемся
onMounted(async () => {
  await fetchingData()
  audio = new Audio('/sounds/icq.mp3')

  open()
  // ждать открытия socket: useWebSocket может открыть асинхронно — подождём событий
  // отправим auth через небольшой таймаут/микротик для гарантии (или слушать onopen)
  setTimeout(() => {
    if (user.value?.id) {
      send(JSON.stringify({type: 'auth', userId: user.value.id}))
    }
  }, 50)
})

// обработка входящих событий
watch(data, (value) => {
  if (!value) return;
  let msg: WSServerMessage
  try {
    msg = JSON.parse(value);
  } catch {
    return;
  }

  // структура: { type: 'message', payload: { ... } }
  if (msg.type === 'message' && msg.payload) {
    const incoming = msg.payload

    // если открыт тот же чат — добавляем сообщение в окно
    if (selectedThread.value?.id === incoming.threadId) {
      messages.value.push(incoming)
      updateDialogAfterIncoming(incoming, {isActive: true})
      scrollDown()
      playSound()
    } else {
      audio?.play()
      updateDialogAfterIncoming(incoming, {isActive: false})
      toastStore.show("пришло сообщение")
      playSound()
    }
  }

  if (msg.type === 'system') {
    // опционально: system сообщения
    console.info('[WS system]', msg.text)
  }
})

// переключение треда — отправляем leave старому (если был), затем join нового
async function selectThread(thread: ThreadDTO) {
  if (selectedThread.value?.id === thread.id) return

  // leave старого
  if (selectedThread.value) {
    send(JSON.stringify({type: 'leave', threadId: selectedThread.value.id}))
  }

  selectedThread.value = thread;
  const {data: msgData} = await useFetch<MessageDTO[]>(`/api/threads/${thread.id}/messages`);
  messages.value = msgData.value ?? []

  // join нового
  send(JSON.stringify({type: 'join', threadId: thread.id, name: user.value!.name, senderId: user.value!.id}))
  await scrollDown()
}

// отправка сообщения
function sendMessage() {
  if (!messageInput.value.trim() || !selectedThread.value) return;
  // отправляем просто текст — сервер привяжет по текущему context.threadId
  send(JSON.stringify({type: 'message', text: messageInput.value}));
  updateDialogAfterOutgoing(selectedThread.value, messageInput.value)

  messageInput.value = '';
}

// вспомогательные функции для обновления списка диалогов
function updateDialogAfterIncoming(incoming: MessageDTO, {isActive}: { isActive: boolean }) {
  const idx = threads.value.findIndex(t => t.id === incoming.threadId)
  if (idx !== -1) {
    const dialog = threads.value[idx]
    if (!dialog) return

    dialog.lastMessage = {body: incoming.body, sender: incoming.sender, createdAt: incoming.createdAt}
    if (!isActive) {
      dialog.unreadCount = (dialog.unreadCount ?? 0) + 1
    }
    // поднять в начало
    threads.value.splice(idx, 1)
    threads.value.unshift(dialog)
  } else {
    // если диалог новый — вставляем
    threads.value.unshift({
      id: incoming.threadId,
      title: incoming.threadTitle ?? null,
      lastMessage: {body: incoming.body, sender: incoming.sender, createdAt: incoming.createdAt},
      unreadCount: 1,
      otherUser: []
    } as unknown as ThreadDTO)
  }
}

function updateDialogAfterOutgoing(thread: ThreadDTO, text: string) {
  const idx = threads.value.findIndex(t => t.id === thread.id)
  if (idx !== -1) {
    const dialog = threads.value[idx]
    dialog!.lastMessage = {
      body: text,
      sender: {id: user.value!.id, name: user.value!.name},
      createdAt: new Date().toISOString()
    }
    // положить наверх
    threads.value.splice(idx, 1)
    threads.value.unshift(dialog!)
  }
}

function threadImg(thread: ThreadDTO) {
  if (thread.otherUser.length === 1 && thread.otherUser[0]) {
    if (thread.otherUser[0].user.img) {
      return thread.otherUser[0].user.img
    }
    if (thread.img) {
      return thread.img
    }
  }
  return themeStore.theme === 'light' ? '/user-circle.svg' : '/star.svg'
}

async function scrollDown() {
  await nextTick()
  console.log("messages")
  chatRef.value?.scrollTo({
    top: chatRef.value.scrollHeight,
    behavior: 'instant'
  })
}

let ctx: AudioContext
let buffer: AudioBuffer

onMounted(async () => {
  ctx = new AudioContext()

  const res = await fetch('/sounds/icq.mp3')
  const arr = await res.arrayBuffer()
  buffer = await ctx.decodeAudioData(arr)

  const unlock = async () => {
    await ctx.resume()
    window.removeEventListener('click', unlock)
  }
  window.addEventListener('click', unlock)
})

function playSound() {
  if (ctx.state !== 'running') return
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.connect(ctx.destination)
  src.start()
}
</script>


<template>
  <div class="messenger">

    <aside class="messenger__sidebar">
      <div class="messenger__sidebar-title">
        <h2 class="messenger__common-title">{{ $t('list') }}</h2>
        <BaseButton @click="isOpenModalNewChat = true">{{ $t('newChat') }}</BaseButton>
      </div>
      <ul class="messenger__list">
        <li
            v-for="thread in threads"
            :key="thread.id"
            class="messenger__tread"
            @click="selectThread(thread)"
        >
          <img class="messenger__user-avatar" :src="threadImg(thread)" alt="thread photo" width="36" height="36">
          <div class="messenger__tread-text">
            <span> {{ thread.title ? thread.title : thread.otherUser[0]!.user.name }}</span>
            <small v-if="thread.lastMessage" class="messenger__last-message">{{ thread.lastMessage.body }}</small>

          </div>
        </li>
      </ul>

    </aside>


    <main class="messenger__chat">

      <div v-if="selectedThread" ref="chatRef" class="messenger__content">
        <h3 class="messenger__title">
          {{ selectedThread.title ? selectedThread.title : selectedThread.otherUser[0]!.user.name }}</h3>

        <div class="messenger__chat-history">
          <div v-for="(msg, i) in messages" :key="i" class="messenger__message-wrapper">
            <p :class="[msg.sender.name === user!.name ? 'messenger__message_own':'messenger__message_other', 'messenger__message']">
              {{ msg.body }}</p>

          </div>
        </div>

        <form class="messenger__form">

          <base-text-input v-model="messageInput" placeholder="Type a message" :full-width="true"/>
          <BaseButton variant="secondary" @click="sendMessage">Send</BaseButton>
        </form>
      </div>
    </main>

    <Modal v-model="isOpenModalNewChat">
      <NewChat :update-threds="fetchingData"/>
    </Modal>
  </div>
</template>

<style lang="scss">

.messenger {
  display: flex;
  height: 100%;

  &__sidebar {
    border-right: 1px solid var(--stroke);
    height: 100%;
    padding: 32px 29px;
    width: 100%;
    max-width: 345px;
  }

  &__content {
    max-height: 100%;
    width: 100%;
    overflow-y: auto;
    padding: 10px;
  }

  &__chat {
    padding: 30px 10px 46px 10px;
    position: relative;
    width: 100%;
  }

  &__title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  &__message-wrapper {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  &__message {
    font-weight: 400;
    font-size: 14px;
    line-height: 1.28;
    color: var(--text);
    border-radius: 8px 8px 8px 0;
    padding-block: 12px;
    padding-inline: 24px;
    max-width: 402px;
    width: fit-content;

    &_own {
      background: var(--frame-2);
      margin-left: auto;
    }

    &_other {
      background: var(--color-1);
    }
  }

  &__form {
    position: absolute;
    left: 10px;
    bottom: 0;
    width: 90%;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__sidebar-title {
    display: flex;
    justify-content: space-between;

    margin-bottom: 25px;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__common-title {
    display: block;
  }

  &__user-avatar {
    border-radius: 50%;
  }

  &__tread {
    display: flex;
    align-items: center;
    background: var(--background);
    padding: 15px 12px;
    border-radius: 14px;
    gap: 12px;
  }

  &__tread-text {
    display: flex;
    flex-direction: column;
  }
}
</style>