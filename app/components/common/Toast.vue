<script setup lang="ts">
import {useToastStore} from '@/stores/toast'

const toastStore = useToastStore()
const {toasts} = storeToRefs(toastStore)
</script>

<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast-fade" tag="div">
        <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="['toast', toast.type]"
        >
          <div class="toast-message">{{ toast.message }}</div>
          <div class="toast-progress" :style="{ animationDuration: toast.duration + 'ms' }"></div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<style lang="scss">
.toast-container {
  position: fixed;
  bottom: 1rem;
  right: 0;
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}

.toast {
  position: relative;
  right: 15px;
  bottom: 100%;
  width: 250px;
  padding: 1rem 1.25rem;
  border-radius: 0.6rem;
  color: var(--color-text);
  background-color: var(--frames);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &.success {
    border-left: 4px solid var(--secondary-green);
  }

  &.warning {
    border-left: 4px solid var(--color-2);
  }

  &.error {
    border-left: 4px solid var(--danger);
  }

  .toast-message {
    font-size: 0.9rem;
  }

  .toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: var(--color-primary);
    width: 100%;
    animation-name: progress;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

/* Плавное появление и исчезание */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
