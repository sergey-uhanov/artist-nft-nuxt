<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();
// const router = useRouter();
const status = ref<'pending' | 'success' | 'expired' | 'invalid'>('pending');
const message = ref('');
const {t} = useI18n()
const localePath = useLocalePath()

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    status.value = 'invalid';
    message.value = t('tokenNotFound');
    return;
  }

  try {
    await $fetch('/api/auth/verify', {
      method: 'POST',
      body: {token}
    });
    status.value = 'success';
    message.value = 'Ваша почта успешно подтверждена.';
  } catch (err: any) {
    const code = err?.data?.statusCode;
    if (code === 410) {
      status.value = 'expired';
      message.value = t('tokenExpired');
    } else if (code === 404) {
      status.value = 'invalid';
      message.value = t('invalidToken');
    } else {
      status.value = 'invalid';
      message.value = t('errorVerified');
    }
  }
});
</script>

<template>
  <section class="verify-page">
    <div v-if="status === 'pending'">{{ t('checking') }}</div>

    <div v-else-if="status === 'success'" class="success">
      <h1>{{ t('success') }}</h1>
      <p>{{ message }}</p>
      <NuxtLink :to="localePath('/auth/login')" class="link-login">{{ t('login') }}</NuxtLink>
    </div>

    <div v-else class="error">
      <h1>{{ t('notVerified') }}</h1>
      <p v-html="message"></p>
    </div>
  </section>
</template>

<style lang="scss">
.verify-page {
  max-width: 480px;
  margin: auto;
  padding: 2rem;
}

.success {
  color: var(--success);
}

.error {
  color: var(--danger);
}

.link-login{
  font-size: 1.2rem;
  color: var(--color-text);
  text-decoration: underline;
}
</style>
