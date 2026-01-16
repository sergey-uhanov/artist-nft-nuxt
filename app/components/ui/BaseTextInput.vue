<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  disabled?: boolean
  error?: string
  fullWidth?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  fullWidth: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()

const uid = useId()
const inputId = computed(() => props.id ?? uid)

const isPasswordVisible = ref(false)

const resolvedType = computed(() => {
  if (props.type !== 'password') return props.type
  return isPasswordVisible.value ? 'text' : 'password'
})

const wrapperClasses = computed(() => [
  'input',
  {
    'input--full': props.fullWidth,
    'input--disabled': props.disabled,
    'input--error': Boolean(props.error),
    'input--password': props.type === 'password',
  },
])

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <div :class="wrapperClasses">
    <label
        v-if="label"
        class="input__label"
        :for="inputId"
    >
      {{ label }}
    </label>

    <div class="input__field">
      <input
          :id="inputId"
          class="input__control"
          :type="resolvedType"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @blur="emit('blur')"
      />

      <button
          v-if="type === 'password'"
          class="input__toggle"
          type="button"
          :aria-label="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
          :aria-pressed="isPasswordVisible"
          @click="togglePasswordVisibility"
      >
        {{ isPasswordVisible ? '🙈' : '👁' }}
      </button>
    </div>

    <p
        v-if="error"
        class="input__error"
    >
      {{ error }}
    </p>
  </div>
</template>

<style lang="scss" >
.input {
  display: inline-flex;
  flex-direction: column;
  gap: 0.35rem;
  width: fit-content;

  &--full {
    width: 100%;
  }

  &__label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--secondary);
  }

  &__field {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__control {
    width: 100%;
    padding: 0.65rem 2.5rem 0.65rem 0.75rem;

    border-radius: 0.6rem;
    border: 1px solid var(--stroke);
    background-color: var(--frame-2);

    font-size: 0.9rem;
    color: var(--color-text);

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;

    &::placeholder {
      color: var(--secondary);
      opacity: 0.6;
    }

    &:hover:not(:disabled) {
      border-color: var(--color-primary);
    }

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px var(--10-secondary);
    }

    &:disabled {
      background-color: var(--frames);
      color: var(--secondary);
      cursor: not-allowed;
    }
  }

  &__toggle {
    position: absolute;
    right: 0.5rem;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 2rem;
    height: 2rem;

    background: transparent;
    border: none;
    color: var(--secondary);

    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover {
      color: var(--color-text);
      background-color: var(--10-secondary);
      border-radius: 0.4rem;
    }

    &:focus-visible {
      outline: none;
      box-shadow:
          0 0 0 2px var(--color-bg),
          0 0 0 4px var(--color-primary);
      border-radius: 0.4rem;
    }
  }

  &--error {
    .input__control {
      border-color: var(--danger);

      &:focus {
        box-shadow: 0 0 0 2px rgba(54, 38, 234, 0.35);
      }
    }

    .input__label {
      color: var(--danger);
    }
  }

  &__error {
    font-size: 0.75rem;
    color: var(--danger);
  }

  &--disabled {
    opacity: 0.6;
  }
}

</style>
