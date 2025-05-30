<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw, onMounted, ref } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { useAccessStore } from '@vben/stores';

import { getCurrentTenantByDomain } from '#/api/core/tenant';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const accessStore = useAccessStore();
const tenantId = ref<null | string>(null);
const tenantName = ref<null | string>(null);
const formRef = ref();

// Fetch tenant ID based on current domain
const fetchTenantId = async () => {
  try {
    const domain = window.location.hostname;
    const response = await getCurrentTenantByDomain(domain);
    tenantId.value = response.id.toString();
    tenantName.value = response.name ?? null;
    if (tenantId.value) {
      accessStore.setTenantId(tenantId.value);
    }
    // Update the form field value when tenant name is fetched
    if (formRef.value && tenantName.value) {
      formRef.value.getFormApi().setFieldValue('tenantName', tenantName.value);
    }
  } catch (error) {
    console.error('Failed to fetch tenant ID:', error);
  }
};

onMounted(() => {
  fetchTenantId();
});

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      disabled: true,
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.currentTenant'),
      },
      fieldName: 'tenantName',
      label: $t('authentication.currentTenant'),
      defaultValue: tenantName.value,
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    },
  ];
});
</script>

<template>
  <AuthenticationLogin
    ref="formRef"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="authStore.authLogin"
  />
</template>
