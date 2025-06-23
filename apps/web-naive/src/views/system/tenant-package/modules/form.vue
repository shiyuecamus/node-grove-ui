<script lang="ts" setup>
import type { FormOpenData } from '@vben/constants';
import type { IdType, Recordable } from '@vben/types';

import { nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { FormOpenType } from '@vben/constants';
import { useRequestHandler } from '@vben/hooks';

import { getTenantPackageById } from '#/api/core';
import { useStepForm } from '#/shared/components/common/step-form';

import { forms, stepConfigs } from './schemas';

defineOptions({ name: 'TenantPackageForm' });

const emit = defineEmits<{
  submit: [FormOpenType, IdType | undefined, Recordable<any>];
}>();

const { handleRequest } = useRequestHandler();

const type = ref(FormOpenType.CREATE);
const recordId = ref<IdType | undefined>(undefined);
const loading = ref(false);

// 初始化表单
const [StepForm, stepFormApi] = useStepForm({
  forms,
  stepConfigs,
  showSubmitButton: false,
});
const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-1/2',
  destroyOnClose: true,
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    const values = await stepFormApi.submitAllForms();
    // 只有当表单验证通过时（返回值不为null）才提交并关闭抽屉
    if (values !== null) {
      emit('submit', type.value, recordId.value, values);
      drawerApi.close();
    }
  },
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      await nextTick();

      const { type: t, id } = drawerApi.getData<FormOpenData>();

      type.value = t;
      recordId.value = id;

      if (t === FormOpenType.EDIT) {
        loading.value = true;
        await handleRequest(
          () => getTenantPackageById(recordId.value as IdType),
          (data) => {
            stepFormApi.setValues(data);
            loading.value = false;
          },
          (error) => {
            loading.value = false;
            console.error(error);
          },
        );
      }
    }
  },
});
</script>

<template>
  <Drawer>
    <StepForm v-loading="loading" />
  </Drawer>
</template>

<style scoped></style>
