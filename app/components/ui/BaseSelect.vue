<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'

interface Props {
  items: string[]
  modelValue: string
  variant?: 'default' | 'compact' | 'outlined'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const selected = computed(() => props.modelValue)

function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function select(item: string) {
  emit('update:modelValue', item)
  emit('change', item)
  isOpen.value = false
}

function onClickOutside(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div
      ref="rootRef"
      class="select"
      :class="[`select--${variant}`, { 'select--open': isOpen, 'select--disabled': disabled }]"
  >
    <button class="select__trigger" type="button" @click="toggle">
      <span class="select__value">
        {{ selected.toUpperCase() }}
      </span>

      <span class="select__arrow"/>
    </button>

    <ul :class="['select__dropdown', isOpen ? 'select__dropdown--active' : '']">
      <li
          v-for="item in items"
          :key="item"
          class="select__option"
          :class="{ 'select__option--active': item === selected }"
          @click="select(item)"
      >
        {{ item.toUpperCase() }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.select {
  position: relative;
  width: max-content;
  font-family: inherit;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
  }

  &__value {
    font-weight: 500;
    color: var(--secondary);
  }

  &__arrow {
    width: 6px;
    height: 6px;
    border-right: 2px solid var(--color-text);
    border-bottom: 2px solid var(--color-text);
    transform: rotate(45deg);
    transition: transform 0.2s;
  }

  &--open &__arrow {
    transform: rotate(-135deg);
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 10;
    min-width: 100%;
    background: var(--frames, #fff);
    border-radius: 6px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    padding: 4px 0;
    transform: scaleY(0);
    transition: transform 0.3s;
    transform-origin: top;

    &--active {
      transform: scaleY(1);
    }
  }

  &__option {
    padding: 8px 12px;
    cursor: pointer;
    transition: transform 0.3s, color 0.3s;;


    &:hover {
      transform: scale(1.1);
      color: var(--color-3);
    }

    &--active {
      font-weight: 600;
      background: rgba(0, 0, 0, 0.08);
    }
  }


  &--compact &__trigger {
    padding: 4px 8px;
    font-size: 13px;
  }

  &--outlined &__trigger {
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
