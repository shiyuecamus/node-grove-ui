<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { FormOpenType } from '@vben/constants';
import { $t } from '@vben/locales';

import { useVbenForm } from '#/adapter/form';

defineOptions({ name: 'TenantPackageForm' });

const emit = defineEmits<{
  submit: [Record<string, any>];
}>();

const type = ref(FormOpenType.CREATE);

// 初始化表单
const [Form, formApi] = useVbenForm({
  handleSubmit: (record: Record<string, any>) => emit('submit', record),
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.name'),
        }),
      },
      fieldName: 'name',
      label: $t('page.system.tenantPackage.name'),
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  class: 'w-2/5',
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    nextTick(() => {
      if (isOpen) {
        const { type: t, data } = modalApi.getData<Record<string, any>>();
        type.value = t;
        if (t === FormOpenType.EDIT && data) {
          formApi.setValues(data);
        }
      }
    });
  },
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>

<style scoped></style>
