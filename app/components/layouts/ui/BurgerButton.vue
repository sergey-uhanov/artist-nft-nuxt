<script lang="ts" setup="">
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const toggle = () => {
  emit('update:isOpen', !props.isOpen)
}
</script>

<template>
  <button
      type="button"
      :class="[$style.burger, props.isOpen && $style.open]"
      aria-label="Toggle menu"
      :aria-expanded="props.isOpen"
      @click="toggle"
  >
    <span />
    <span />
    <span />
  </button>
</template>

<style module lang="scss">
.burger {
  width: 32px;
  height: 24px;
  position: relative;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  z-index: 20;

  span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--text);
    border-radius: 2px;
    transition:
        transform 0.3s ease,
        opacity 0.2s ease,
        top 0.3s ease;
  }

  span:nth-child(1) {
    top: 0;
  }

  span:nth-child(2) {
    top: 11px;
  }

  span:nth-child(3) {
    top: 22px;
  }
}



.open {
  span:nth-child(1) {
    top: 11px;
    transform: rotate(45deg);
  }

  span:nth-child(2) {
    opacity: 0;
  }

  span:nth-child(3) {
    top: 11px;
    transform: rotate(-45deg);
  }
}

</style>