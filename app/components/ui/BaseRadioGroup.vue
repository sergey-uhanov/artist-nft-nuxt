<script setup lang="ts">
import { computed } from 'vue'

type RadioOption = {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: string | number | null
  options: RadioOption[]
  name?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const onSelect = (value: string | number) => {
  if (value !== props.modelValue) {
    emit('update:modelValue', value)
  }
}

const isChecked = (value: string | number) =>
    computed(() => props.modelValue === value)
</script>

<template>
  <div class="radio-group" role="radiogroup">
    <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="radio"
        :class="{ 'radio--checked': modelValue === option.value }"
        role="radio"
        :aria-checked="modelValue === option.value"
        @click="onSelect(option.value)"
    >
      <span class="radio__control" />
      <span class="radio__label">{{ $t(option.label) }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.radio-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.radio {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.85rem;

  background: var(--frame-2);
  border: 1px solid var(--stroke);
  border-radius: 0.6rem;

  color: var(--color-text);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: var(--frames);
  }

  &--checked {
    border-color: var(--color-primary);
    background: var(--10-secondary);
  }

  &__control {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid var(--stroke);
    display: grid;
    place-items: center;
    transition: border-color 0.2s ease;
  }

  &--checked &__control {
    border-color: var(--color-primary);

    &::after {
      content: '';
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 50%;
      background: var(--color-primary);
    }
  }

  &__label {
    font-size: 0.9rem;
    font-weight: 500;
    user-select: none;
  }
}
</style>
