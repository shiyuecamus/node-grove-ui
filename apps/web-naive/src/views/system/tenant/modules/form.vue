<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { FormOpenType } from '@vben/constants';
import { $t } from '@vben/locales';

import { useVbenForm, z } from '#/adapter/form';
import { contactSchema } from '#/shared/schema/form';

defineOptions({ name: 'TenantForm' });

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
          name: $t('page.system.tenant.name'),
        }),
      },
      fieldName: 'name',
      label: $t('page.system.tenant.name'),
      rules: 'required',
    },
    {
      component: 'DynamicInput',
      fieldName: 'domain',
      label: $t('page.system.tenant.domain'),
      componentProps: {
        max: 5,
      },
      rules: z
        .array(
          z
            .string()
            .regex(
              /^(?:(?:[a-z0-9-]+\.)+[a-z]{2,}|(?:\d{1,3}\.){3}\d{1,3}(?::\d{1,5})?)$/i,
              $t('errors.invalidDomainOrAddress'),
            ),
        )
        .nonempty({
          message: $t('errors.cannotBeEmptyWithName', {
            name: $t('page.system.tenant.domain'),
          }),
        }),
    },
    ...contactSchema,
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
