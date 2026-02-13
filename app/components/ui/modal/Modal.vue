<script lang="ts" setup="">
import {vScrollLock} from '@vueuse/components'

const {modelValue} = defineProps<{ modelValue: boolean }>()

const emit = defineEmits(['update:modelValue'])


const close = () => {
  emit('update:modelValue', false)

}
</script>

<template>

  <Teleport to="#teleports">
    <Transition name="slide-fade">
      <div v-if="modelValue" v-scroll-lock="modelValue" class="modal-overlay">
        <div class="modal" @click.self="close">
          <div class="modal__contant">
            <slot/>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

</template>

<style lang="scss">
.modal {
  position: absolute;
  inset: 0;
  background-color: var(--overlay);
  z-index: 10000;

  &__contant {
    max-width: 600px;
    margin: 25vh auto;
  }

}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {

  opacity: 0;
}
</style>