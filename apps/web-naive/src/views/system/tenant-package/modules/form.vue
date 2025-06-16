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
  submit: [FormOpenType, number | string | undefined, Record<string, any>];
}>();

const { handleRequest } = useMessageHandler();

const type = ref(FormOpenType.CREATE);
const recordId = ref<number | string | undefined>(undefined);
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
      const { type: t, id } = drawerApi.getData<Record<string, any>>();
      type.value = t;
      recordId.value = id;
      stepFormApi.reset();
      if (t === FormOpenType.EDIT) {
        loading.value = true;
        await handleRequest(
          () => getTenantPackageById(recordId.value as number),
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
