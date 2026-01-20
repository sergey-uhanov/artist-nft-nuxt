<script setup lang="ts">
import {computed} from 'vue'

interface Props {
  fullWidth?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'transparent'| 'social-login'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fullWidth: false,
  variant: 'primary',
  disabled: false,
})

const buttonClasses = computed(() => [
  'btn',
  `btn--${props.variant}`,
  {
    'btn--full': props.fullWidth,
    'btn--disabled': props.disabled,
  },
])
</script>

<template>
  <span
      class="btn"
      :class="buttonClasses"
      :disabled="disabled"
      v-bind="$attrs"
  >
    <slot/>
  </span>
</template>

<style lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: none;

  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1;

  cursor: pointer;
  transition: background 0.2s ease,
  color 0.2s ease,
  box-shadow 0.2s ease,
  transform 0.1s ease;

  color: var(--btn-text, var(--color-text));
  background: var(--btn-bg);

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

  &:hover:not(.btn--disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
  }

  &:active:not(.btn--disabled) {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
  }

  &--full {
    width: 100%;
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  &--primary {
    --btn-bg: var(--background-primary-button);
    --btn-text: var(--background);
  }

  &--social-login {
    --btn-bg: var(--background-secondary-button);
    --btn-text: var(--background);
    line-height: 1.42;
    background: var(--background-primary-button);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    font-size: 14px;
  }

  &--secondary {
    --btn-bg: var(--background-secondary-button);
    --btn-text: var(--color-text);
    font-weight: 700;
    font-size: 18px;
    line-height: 1.33;
    font-family: var(--font-family);
    border: 1px solid var(--stroke);

    &:hover:not(.btn--disabled) {
      background: var(--background-secondary-button-hover);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--color-primary);
    box-shadow: none;

    &:hover:not(.btn--disabled) {
      background: var(--10-secondary);
    }
  }
}

</style>
