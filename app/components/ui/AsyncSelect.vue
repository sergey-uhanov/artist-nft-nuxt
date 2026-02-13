<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useEventListener} from '@vueuse/core' // опционально, удобно для клика по документу

// ----- Props -----
const props = defineProps({
  api: {type: String},
  fetcher: {type: () => Promise<unknown>, required: false},
  modelValue: {type: [Array, Object, String, Number, null], default: null},
  limit: {type: Number, default: 10},
  multiple: {type: Boolean, default: false},
  searchable: {type: Boolean, default: true},
  debounceMs: {type: Number, default: 300},
  minSearchLength: {type: Number, default: 0},

  itemKey: {type: String, default: 'id'},
  labelKey: {type: String, default: 'name'},
  subLabelKey: {type: String, default: ''},
  placeholder: {type: String, default: 'Поиск...'},
  autoLoad: {type: Boolean, default: true},
})

const emit = defineEmits(['update:modelValue'])


const items = ref<unknown[]>([])
const nextCursor = ref<string | null>(null)
const hasNext = ref(true)
const loading = ref(false)
const loadingMore = ref(false)
const error = ref<string | null>(null)

const open = ref(false)
const search = ref('')
const searchDebounced = ref('')
const focusedIndex = ref<number>(-1)

const sentinel = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)


const uid = Math.random().toString(36).slice(2, 9)
const listId = `async-select-list-${uid}`


const selected = ref<string | null>(null)
const selectedArray = ref<string[]>([])

if (props.multiple) {
  // normalize initial modelValue
  if (Array.isArray(props.modelValue) && props.modelValue.length) selectedArray.value = [...props.modelValue]
} else {
  console.log(props.modelValue)
  // if (props.modelValue) selected.value = props.modelValue
}

// react to external v-model changes
watch(
    () => props.modelValue,
    (v) => {
      if (props.multiple) {
        selectedArray.value = Array.isArray(v) ? [...v] : []
      } else {
        console.log(v)
        selected.value = v
      }
    }
)

// ----- helpers -----
const itemKey = props.itemKey
const labelKey = props.labelKey
const subLabelKey = props.subLabelKey || ''

const canClear = computed(() => {
  return props.multiple ? selectedArray.value.length > 0 : !!selected.value
})


let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(
    () => search.value,
    (v) => {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        searchDebounced.value = v
        resetAndLoad()
      }, props.debounceMs)
    }
)


async function rawFetch(cursor?: string | null) {
  const q: any = {limit: props.limit}
  if (cursor) q.cursor = cursor
  if (props.searchable && searchDebounced.value && searchDebounced.value.length >= props.minSearchLength) {
    q.search = searchDebounced.value
  }

  // decide which fetch method to use
  if (props.fetcher) {
    return await props.fetcher(q)
  }
  if (props.api) {
    // $fetch is available in Nuxt 4
    // API contract: returns { items: [], nextCursor: string|null, hasNextPage: boolean }
    return await $fetch(props.api, {query: q})
  }
  throw new Error('AsyncSelect: neither api nor fetcher provided')
}

async function resetAndLoad() {
  items.value = []
  nextCursor.value = null
  hasNext.value = true
  focusedIndex.value = -1
  if (props.autoLoad) await loadMore()
}

async function loadMore() {
  if (!hasNext.value) return
  if (loading.value) return
  try {
    if (items.value.length === 0) {
      loading.value = true
    } else {
      loadingMore.value = true
    }
    error.value = null

    const res = await rawFetch(nextCursor.value)
    // expecting contract: { items, nextCursor, hasNextPage }
    const newItems = (res && res.items) || []
    items.value.push(...newItems)
    nextCursor.value = res.nextCursor ?? null
    hasNext.value = !!res.hasNextPage
  } catch (err: any) {
    console.error(err)
    error.value = err?.message ?? 'Ошибка загрузки'
    hasNext.value = false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function isSelected(item: any) {
  if (props.multiple) return selectedArray.value.some((v) => v[itemKey] === item[itemKey])
  return selected?.value ? selected.value[itemKey] === item[itemKey] : false
}

function onSelect(item: any) {

  if (props.multiple) {

    const idx = selectedArray.value.findIndex((v) => v[itemKey] === item[itemKey])
    if (idx >= 0) {
      selectedArray.value.splice(idx, 1)
    } else {
      selectedArray.value.push(item)
    }
    emit('update:modelValue', [...selectedArray.value])
    console.log('selected arr', selectedArray.value)
  } else {
    selected.value = item
    emit('update:modelValue', item)
    open.value = false
  }
}

function removeTag(item: any) {
  const idx = selectedArray.value.findIndex((v) => v[itemKey] === item[itemKey])
  if (idx >= 0) {
    selectedArray.value.splice(idx, 1)
    emit('update:modelValue', [...selectedArray.value])
  }
}

function clear() {
  if (props.multiple) {
    selectedArray.value = []
    emit('update:modelValue', [])
  } else {
    selected.value = null
    emit('update:modelValue', null)
  }
}

// ----- open / close / toggle -----
function toggleOpen() {
  open.value = !open.value
  if (open.value) {
    // focus input after open
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

// ----- keyboard helpers (basic) -----
function focusNext() {
  if (items.value.length === 0) return
  focusedIndex.value = Math.min(items.value.length - 1, focusedIndex.value + 1)
  scrollToFocused()
}

function focusPrev() {
  if (items.value.length === 0) return
  focusedIndex.value = Math.max(0, focusedIndex.value - 1)
  scrollToFocused()
}

function selectFocused() {
  console.log('selectFocused work')
  if (focusedIndex.value >= 0 && items.value[focusedIndex.value]) {
    onSelect(items.value[focusedIndex.value])
  }
}

function scrollToFocused() {
  nextTick(() => {
    const list = listRef.value
    const el = list?.querySelectorAll('.async-select__option')[focusedIndex.value] as HTMLElement | undefined
    if (el && list) {
      const top = el.offsetTop
      const bottom = top + el.offsetHeight
      if (top < list.scrollTop) list.scrollTop = top
      if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight
    }
  })
}

// ----- intersection observer for infinite scroll -----
let observer: IntersectionObserver | null = null
onMounted(() => {
  // global click outside to close
  useEventListener(window, 'click', (e: Event) => {
    const path = (e.composedPath && e.composedPath()) || (e as any).path || []
    // if click outside component root, close
    const root = (listRef.value?.closest('.async-select') || null)
    if (root && !path.includes(root)) {
      open.value = false
    }
  })

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && hasNext.value && !loadingMore.value) {
        loadMore()
      }
    })
  }, {root: listRef.value, rootMargin: '200px'})

  nextTick(() => {
    if (sentinel.value && observer) observer.observe(sentinel.value)
  })

  // initial load
  if (props.autoLoad) resetAndLoad()
})

onBeforeUnmount(() => {
  if (observer && sentinel.value) observer.unobserve(sentinel.value)
})

watch(open, async (v) => {
  if (!v) return

  await nextTick()

  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNext.value && !loadingMore.value) {
          loadMore()
        }
      },
      {
        root: listRef.value,
        rootMargin: '200px',
      }
  )

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
})

</script>

<template>
  <div class="async-select" :class="{ 'async-select--open': open }">
    <div class="async-select__control" @click="toggleOpen" role="combobox" :aria-expanded="open" :aria-owns="listId">
      <div class="async-select__value">
        <template v-if="multiple">
          <span v-for="val in selectedArray" :key="val[itemKey]" class="async-select__tag">
            {{ val[labelKey] }}
            <button type="button" class="async-select__tag-remove" @click.stop="removeTag(val)">×</button>
          </span>
          <input
              v-if="searchable"
              ref="searchInput"
              class="async-select__input"
              v-model="search"
              :placeholder="placeholder"
              @keydown.down.prevent="focusNext"
              @keydown.up.prevent="focusPrev"
              @keydown.enter.prevent="selectFocused"
          />
        </template>

        <template v-else>
          <span v-if="selected" class="async-select__single">{{ selected[labelKey] }}</span>
          <input
              v-else-if="searchable"
              ref="searchInput"
              v-model="search"
              class="async-select__input"
              :placeholder="placeholder"
              @keydown.down.prevent="focusNext"
              @keydown.up.prevent="focusPrev"
              @keydown.enter.prevent="selectFocused"
          >
        </template>
      </div>

      <button class="async-select__clear" v-if="canClear" @click.stop="clear">✕</button>
      <span class="async-select__caret">▾</span>
    </div>

    <div v-if="open" class="async-select__menu" :id="listId" role="listbox" :aria-multiselectable="multiple">
      <div class="async-select__list" ref="listRef">
        <template v-if="items.length === 0 && !loading && !error">
          <div class="async-select__empty">Нет результатов</div>
        </template>

        <template v-for="(item, idx) in items" :key="item[itemKey]">
          <slot name="item" :item="item" :index="idx" :selected="isSelected(item)" :select="() => onSelect(item)"/>


        </template>

        <!-- sentinel for intersection observer -->
        <div ref="sentinel" class="async-select__sentinel"/>

        <div v-if="loadingMore" class="async-select__loading-more">Загрузка...</div>
        <div v-if="loading && items.length === 0" class="async-select__loading">Загрузка...</div>
        <div v-if="error" class="async-select__error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
.async-select {
  position: relative;
  width: 100%;
  font-family: Inter, system-ui, sans-serif;

  &__control {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--secondary);
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    background: var(--background);
  }

  &__value {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    flex-wrap: wrap;
  }

  &__input {
    border: none;
    outline: none;
    min-width: 120px;
    font-size: 14px;
  }

  &__tag {
    background: var(--background-secondary-button);
    padding: 4px 8px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__tag-remove {
    background: transparent;
    border: none;
    cursor: pointer;
  }

  &__caret {
    margin-left: auto;
  }

  &__menu {
    position: absolute;
    width: 100%;
    max-height: 320px;
    overflow: hidden;
    background: var(--background);
    border: 1px solid #e6e6e6;
    border-radius: 6px;
    margin-top: 6px;
    z-index: 40;
  }

  &__list {
    max-height: 320px;
    overflow-y: auto;
  }

  &__option {
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  &__option--focused {
    background: var(--color-3);
  }

  &__option--selected {
    background: #eef7ff;
  }

  &__empty,
  &__loading,
  &__error {
    padding: 12px;
    text-align: center;
    color: #666;
  }

  &__sentinel {
    height: 1px;
  }

  .async-select__option-default {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .async-select__avatar img {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    object-fit: cover;
  }

  .async-select__label {
    font-weight: 600;
  }

  .async-select__sub {
    font-size: 12px;
    color: #777;
  }
}
</style>
