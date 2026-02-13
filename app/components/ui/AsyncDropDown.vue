<script lang="ts" setup="">
import {ref} from 'vue'
import {onClickOutside} from '@vueuse/core'
import BaseTextInput from "~/components/ui/BaseTextInput.vue";
import SvgIcon from "~/components/common/SvgIcon.vue";
import type {UserData} from "#shared/types/messanges/messager.types";


interface Props {
  api: string
  modelValue: UserData[]
  isMultiple?: boolean
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  isMultiple: true,
  limit: 20,
})

const {api, isMultiple, modelValue, limit} = toRefs(props)

const emit = defineEmits<{
  (e: 'update:modelValue', value:UserData[]): void
}>()

const config = useRuntimeConfig()
const isOpen = ref(false)
const root = ref<HTMLDivElement | null>(null)
const search = ref('')
const arrItems = ref<UserData[]>([])
const nextCursor = ref<string | null>(null)
const hasNextPage = ref(true)
const isLoading = ref(false)

const observerTarget = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
const limitItems = ref<number>(Math.min(50, Math.max(0, limit)) || 10)
const selectedArray = ref<UserData[]>([])

async function fetchData(loadMore = false) {
  if (isLoading.value) return
  if (loadMore && !hasNextPage.value) return

  isLoading.value = true

  try {
    const data = await $fetch(api.value, {
      baseURL:config.public.apiBase,
      query: {
        limit: limitItems.value,
        search: search.value || undefined,
        cursor: loadMore ? nextCursor.value : undefined,
      },
    })

    if (loadMore) {
      arrItems.value.push(...data.items)
    } else {
      arrItems.value = data.items
    }

    nextCursor.value = data.nextCursor
    hasNextPage.value = data.hasNextPage

    await nextTick()
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}


function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function select(value: UserData) {
  if (isMultiple.value) {
    const index = selectedArray.value.findIndex(
        item => item.id === value.id
    )

    if (index === -1) {
      selectedArray.value.push(value)
      emit('update:modelValue', selectedArray.value)
      return
    }
    selectedArray.value.splice(index, 1)
    emit('update:modelValue', selectedArray.value)
    return
  }

  selectedArray.value = [value]
  emit('update:modelValue', selectedArray.value)
  close()
}

onClickOutside(root, close)

function isActive(id: string) {
  const result = selectedArray.value.filter((item) => item.id === id)
  return !!result.length
}

function deleteItem(id: string) {
  selectedArray.value = selectedArray.value.filter((item) => item.id !== id)
}

function initObserver() {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {

          fetchData(true)
        }
      },
      {rootMargin: '100px'}
  )

  if (observerTarget.value) {

    observer.observe(observerTarget.value)
  }
}

watch(observerTarget, () => {
  if (observerTarget.value) observer?.observe(observerTarget.value)

})

watch(search, async () => {
  nextCursor.value = null
  hasNextPage.value = true
  await fetchData(false)
  initObserver()
})

onMounted(async () => {
  await fetchData()
  initObserver()
})

function clear() {
  selectedArray.value = []
  emit('update:modelValue', [])
}

defineExpose({
  clear,
})
</script>

<template>
  <div ref="root" class="async-select">
    <button
        v-if="!selectedArray.length"
        class="async-select__trigger"
        type="button"
        @click.stop="toggle"
        @keydown.enter.prevent="toggle"
        @keydown.esc="close"
    >
      {{ $t('chat.select') }}
    </button>
    <div v-else class="async-select__selected-list" @click.stop="toggle">
      <span v-for="selectedItem in selectedArray" :key="selectedItem.id" class="async-select__selected-item">
        {{ selectedItem.name }}
        <span class="async-select__selected-item-del" @click.stop="deleteItem(selectedItem.id)">X</span>
      </span>
    </div>


    <Transition name="select">
      <ul v-if="isOpen" class="async-select__dropdown">
        <li>
          <BaseTextInput v-model="search" :full-width="true">
            <template #icon>
              <SvgIcon name="star"/>
            </template>
          </BaseTextInput>
        </li>

        <li
            v-for="option in arrItems"
            :key="option.id"
            class="async-select__option"
            :class="{ 'async-select__option--active': isActive(option.id) }"
            @click="select(option)"
        >
          {{ option.name }}
        </li>
        <li
            v-if="hasNextPage"
            ref="observerTarget"
            class="async-select__loader"
        >
          {{ $t('loading') }}
        </li>
      </ul>
    </Transition>

  </div>
</template>


<style lang="scss">
.async-select {
  position: relative;
  width: 100%;
  background: var(--background);
  border-radius: 15px;

  &-enter-active,
  &-leave-active {
    transition: opacity 0.5s, transform 0.3s;
    transform-origin: top;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: scaleY(0);
  }

  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--background);
    border-radius: 15px;
    color: var(--color-text);
    width: 100%;
    border: 1px solid var(--color-bg);
    padding: 5px 15px;
    max-height: 400px;
    overflow-y: auto;
  }

  &__trigger {
    background: transparent;
    color: var(--color-text);
    width: 100%;
    padding: 15px;
  }

  &__option {
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    &--active {
      background: var(--text-secondary-button);
    }
  }

  &__selected-list {
    min-height: 48px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__selected-item {
    padding: 15px;
    min-height: 52px;
    background: #0f172a;
    border-radius: 15px;


    &-del {
      cursor: pointer;
      transition: transform 0.5s, color 0.5s;

      @media (hover: hover) {
        &:hover {
          transform: scale(1.3);
          color: red;
        }
      }
    }
  }
}
</style>