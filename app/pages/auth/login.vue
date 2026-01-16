<script lang="ts" setup="">
import SvgIcon from "~/components/common/SvgIcon.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import BaseTextInput from "~/components/ui/BaseTextInput.vue";
import {type LoginForm, loginSchema, parseZodErrors} from '@@/shared/validation/auth.schema'
import type { ZodError } from 'zod'

const localePath = useLocalePath()
const { t } = useI18n()
definePageMeta({
  layout: 'auth'
})



const loginData = reactive<{ email: string, password: string }>({
  email: '',
  password: '',
})

// const errors = ref<{ email: string, password: string }>({
//   email: '',
//   password: '',
// })
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

const submit = () => {

  if (!validate()) return

  // запрос на сервер
}
</script>

<template>
  <form @submit="submit" class="login-form">
    <SvgIcon name="logo" width="161" height="46" class="text-primary hover:text-secondary"/>
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

    <BaseTextInput
        @click.prevent=""
        v-model="loginData.email"
        :label="$t('email')"
        :placeholder="$t('placeholders.email')"
        type="email"
        fullWidth
        @blur="validateField('email')"
        :error="errors.email"
    />

    <BaseTextInput
        v-model="loginData.password"
        :label="$t('password')"
        type="password"
        :placeholder="$t('placeholders.password')"
        :error="errors.password"
        @blur="validateField('password')"
        fullWidth
    />
    <BaseButton @click="submit" type="submit" variant="primary" full-width>
      {{ $t('submit') }}
    </BaseButton>

    <div class="login-form__reset-password-wrapper">
      <p class="login-form__reset-password">
        {{ $t('resetPassword') }}
      </p>

      <NuxtLink :to="localePath('/auth/recover-password')">
        {{ $t('resetPasswordLink') }}
      </NuxtLink>
    </div>
  </form>

</template>

<style lang="scss">

</style>