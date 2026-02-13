<script lang="ts" setup="">
import BaseRadioGroup from "~/components/ui/BaseRadioGroup.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import AsyncDropDown from "~/components/ui/AsyncDropDown.vue";
import type { UserData} from "#shared/types/messanges/messager.types";


const emit = defineEmits<{
  (e: 'update-threads'): void
}>()


const typeChat = ref<'SINGLE_CHAT' | 'GROUP_CHAT'>('SINGLE_CHAT');
const config = useRuntimeConfig()
const chooseUser = ref<UserData[]>([]);
const dropdownRef = ref<InstanceType<typeof AsyncDropDown> | null>(null)
const options = [
  {label: 'chat.single', value: 'SINGLE_CHAT'},
  {label: 'chat.group', value: 'GROUP_CHAT'},

]

watch(typeChat, () => {

  if (typeChat.value === 'SINGLE_CHAT' && chooseUser.value.length > 1) {
    chooseUser.value = []
    dropdownRef.value?.clear()
  }
})

function createChat() {
  if (chooseUser.value.length < 1) return

  try {
    const req = $fetch('/api/threads/threads', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: {
        title: '',
        recipientId: chooseUser.value[0]!.id
      }
    })
    emit('update-threads')
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div class="modal-new-chat">
    <p class="modal-new-chat__title">
      {{ $t('createTitle') }}
    </p>

    <BaseRadioGroup v-model="typeChat" class="modal-new-chat__radiobutton" :options="options"/>

    <AsyncDropDown ref="dropdownRef" v-model="chooseUser" api="api/users" :limit="10"
                   :is-multiple="typeChat === 'GROUP_CHAT'"/>

    <BaseButton class="modal-new-chat__submit-button" @click="createChat">
      {{ $t('create') }}
    </BaseButton>
  </div>

</template>

<style lang="scss">

.modal-new-chat {
  max-width: 600px;
  width: 100%;
  background: var(--frame-2);
  padding: 20px;

  &__title {
    font-weight: 700;
    font-size: 36px;
    line-height: 1.375;
    text-align: center;
    color: var(--text);
    margin-bottom: 25px;
  }

  &__submit-button {
    margin-top: 25px;
  }

  &__radiobutton {
    margin-bottom: 25px;
  }

  &__select {
    margin-bottom: 25px;
  }
}

.item {
  border: 1px solid var(--color-primary);
  margin: 5px;

  &_active {
    background: var(--color-3);
  }
}
</style>