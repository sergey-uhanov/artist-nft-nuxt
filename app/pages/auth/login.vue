<script lang="ts" setup="">
import SvgIcon from "~/components/common/SvgIcon.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import BaseTextInput from "~/components/ui/BaseTextInput.vue";
import {type LoginForm, loginSchema, parseZodErrors} from '@@/shared/validation/auth.schema'
import Toast from "~/components/common/Toast.vue";
import type {NuxtError} from "#app";


definePageMeta({
  layout: 'auth'
})

const localePath = useLocalePath()
const loading = ref(false)
const {t} = useI18n()

const toastStore = useToastStore()

const loginData = reactive<{ email: string, password: string }>({
  email: '',
  password: '',
})


const errors = ref<Record<string, string>>({})


function validate() {
  const result = loginSchema.safeParse(loginData)

  if (!result.success) {
    const rawErrors = parseZodErrors(result.error)

    errors.value = Object.fromEntries(
        Object.entries(rawErrors).map(([field, key]) => [
          field,
          t(key),
        ])
    )

    return false
  }

  errors.value = {}
  return true
}

const validateField = (field: keyof LoginForm) => {

  const result = loginSchema.safeParse(loginData)

  if (!result.success) {
    const rawErrors = parseZodErrors(result.error)

    errors.value = Object.fromEntries(
        Object.entries(rawErrors).filter((item) => item[0] === field).map(([f, k]) => [
          f,
          t(k),
        ])
    )
  }
}

async function onLogin() {
  if (!validate()) return

  try {
    loading.value = true
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: loginData.email,
        password: loginData.password
      }
    })

    navigateTo('/')

  } catch (e) {

    const err = e as NuxtError<{ data: { code: string } }>
    const code = err.data?.data?.code

    if (code) {
      toastStore.show(t(`errors.${code}`), 'error', 4000)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="">
    <form @submit="onLogin" class="login-form">
      <SvgIcon name="logo" width="161" height="46" class="login-form__login-icon"/>
      <h1 class="login-form__title">{{ $t('authorization') }}</h1>

      <div class="login-form__btn-wrapper">
        <BaseButton variant="primary">
          {{ $t('login') }}
        </BaseButton>


        <NuxtLink :to="localePath('/auth/register')">
          <BaseButton variant="ghost">
            {{ $t('registr') }}
          </BaseButton>
        </NuxtLink>
      </div>

      <div class="login-form__social-wrapper">
        <NuxtLink class="login-form__social-link" to="/oauth/google" external>
          <BaseButton variant="social-login" class="login-form__social-btn">
            <SvgIcon name="google" width="20" height="20" class="login-form__social-icon"/>
            {{ $t('loginWithGoogle') }}
          </BaseButton>
        </NuxtLink>
        <NuxtLink to="/oauth/github" external>
          <BaseButton variant="social-login" class="login-form__social-btn">
            <SvgIcon name="github" width="20" height="20" class="login-form__social-icon"/>
            {{ $t('loginWithGitHub') }}
          </BaseButton>
        </NuxtLink>
      </div>

      <BaseTextInput
          @click.prevent=""
          v-model="loginData.email"
          :label="$t('email')"
          :placeholder="$t('placeholders.email')"
          type="email"
          fullWidth
          @blur="validateField('email')"
          @input="errors.email? validateField('password'): null"
          :error="errors.email"
          class="login-form__email-input"
      />

      <BaseTextInput
          v-model="loginData.password"
          :label="$t('password')"
          type="password"
          :placeholder="$t('placeholders.password')"
          :error="errors.password"
          @blur="validateField('password')"
          @input="errors.password? validateField('password'): null"
          fullWidth
          class="login-form__password-input"
      />
      <BaseButton :disabled="loading" @click="onLogin" type="submit" variant="primary" full-width>
        {{ $t('submit') }}
      </BaseButton>

      <div class="login-form__reset-password-wrapper">
        <p class="login-form__reset-password">
          {{ $t('resetPassword') }}
        </p>

        <NuxtLink class="login-form__reset-password-link" :to="localePath('/auth/recover-password')">
          {{ $t('resetPasswordLink') }}
        </NuxtLink>
      </div>
    </form>
    <Toast/>
  </div>
</template>

<style lang="scss">
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  max-width: 500px;
  background: var(--bagckground-card);
  border-radius: 15px;
  margin-inline: auto;
  margin-top: 10vh;

  &__title {
    margin-bottom: 12px;
  }

  &__btn-wrapper {
    border-radius: 12px;
    padding: 7px 8px;
    background: var(--frames);
    margin-bottom: 20px;
  }

  &__social-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-bottom: 20px;
  }

  &__email-input {
    margin-bottom: 10px;
  }

  &__password-input {
    margin-bottom: 20px;
  }

  &__reset-password-wrapper {
    display: flex;
    gap: 8px;
    line-height: 1.5;
    color: var(--secondary);
    font-weight: 400;
    font-size: 14px;
    margin-top: 15px;
  }

  &__reset-password-link {
    line-height: 1.5;
    text-decoration: underline;
    text-decoration-skip-ink: none;
    color: var(--color-3);
  }

  &__social-icon {
    margin-right: 8px;
  }
}

</style>