<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const status = ref<'pending' | 'success' | 'expired' | 'invalid'>('pending');
const message = ref('');

onMounted(async () => {
  const token = (route.query.token as string) || '';

  if (!token) {
    status.value = 'invalid';
    message.value = 'Токен отсутствует.';
    return;
  }

  try {
    await $fetch('/api/auth/verify', {
      method: 'POST',
      body: { token }
    });
    status.value = 'success';
    message.value = 'Ваша почта успешно подтверждена.';
  } catch (err: any) {
    const code = err?.data?.statusCode;
    if (code === 410) {
      status.value = 'expired';
      message.value = 'Срок действия ссылки истёк. <a href="/resend">Отправить заново</a>';
    } else if (code === 404) {
      status.value = 'invalid';
      message.value = 'Неверный токен.';
    } else {
      status.value = 'invalid';
      message.value = 'Произошла ошибка. Попробуйте ещё.';
    }
  }
});
</script>

<template>
  <section class="verify-page">
    <div v-if="status === 'pending'">Проверка…</div>

    <div v-else-if="status === 'success'" class="success">
      <h1>Успех!</h1>
      <p v-html="message"></p>
      <NuxtLink to="/login">Войти</NuxtLink>
    </div>

    <div v-else class="error">
      <h1>Не удалось подтвердить почту</h1>
      <p v-html="message"></p>
      <NuxtLink to="/resend">Отправить ссылку повторно</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.verify-page { max-width: 480px; margin: auto; padding: 2rem; }
.success { color: green; }
.error { color: red; }
</style>
