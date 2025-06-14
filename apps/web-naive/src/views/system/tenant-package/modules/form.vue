<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { FormOpenType } from '@vben/constants';
import { useMessageHandler } from '@vben/hooks';

import { getTenantPackageById } from '#/api/core/tenant-package';
import { useStepForm } from '#/shared/components/common/step-form';

import { forms, stepConfigs } from './schemas';

defineOptions({ name: 'TenantPackageForm' });

const emit = defineEmits<{
  submit: [FormOpenType, Record<string, any>];
}>();

const { handleRequest } = useMessageHandler();

const type = ref(FormOpenType.CREATE);
const loading = ref(false);

// 初始化表单
const [StepForm, stepFormApi] = useStepForm({
  onComplete: (allValues: any) => {
    emit('submit', type.value, allValues);
    drawerApi.close();
  },
  forms,
  stepConfigs,
  showSubmitButton: true,
});
const [Drawer, drawerApi] = useVbenDrawer({
  footer: false,
  class: 'w-1/2',
  destroyOnClose: true,
  onCancel() {
    drawerApi.close();
  },
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      await nextTick();
      const { type: t, id } = drawerApi.getData<Record<string, any>>();
      type.value = t;
      if (t === FormOpenType.EDIT) {
        loading.value = true;
        await handleRequest(
          () => getTenantPackageById(id),
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
