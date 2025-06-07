<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { FormOpenType } from '@vben/constants';
import { $t } from '@vben/locales';

import { useStepForm } from '#/shared/components/common/step-form';

defineOptions({ name: 'TenantPackageForm' });

const emit = defineEmits<{
  submit: [Record<string, any>];
}>();

const type = ref(FormOpenType.CREATE);

// 初始化表单
const [StepForm] = useStepForm({
  onComplete: (allValues: any) => {
    emit('submit', allValues);
  },
  forms: [
    {
      schema: [
        {
          component: 'Input',
          componentProps: {
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t('page.system.tenantPackage.name'),
            }),
          },
          formItemClass: 'col-span-2',
          fieldName: 'name',
          label: $t('page.system.tenantPackage.name'),
          rules: 'required',
        },
        {
          component: 'SubForm',
          componentProps: {
            title: $t('page.system.tenantPackage.configInfo'),
            defaultExpanded: true,
            schemas: [
              {
                label: $t('page.system.tenantPackage.name'),
                fieldName: 'name',
                component: 'Input',
                componentProps: {
                  placeholder: $t('ui.placeholder.inputWithName', {
                    name: $t('page.system.tenantPackage.name'),
                  }),
                },
              },
            ],
          },
          hideLabel: true,
          formItemClass: 'col-span-2',
          fieldName: 'configData',
        },
      ],
      wrapperClass: 'grid-cols-2',
    },
  ],
  stepConfigs: [
    // {
    //   title: $t('page.system.tenantPackage.baseInfo'),
    //   icon: 'lucide:info',
    //   description: $t('page.system.tenantPackage.baseInfoDescription'),
    // },
    {
      title: $t('page.system.tenantPackage.configInfo'),
      icon: 'lucide:settings',
      description: $t('page.system.tenantPackage.configInfoDescription'),
    },
  ],
  showSubmitButton: true,
});
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  footer: false,
  class: 'w-2/5',
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    // await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    nextTick(() => {
      if (isOpen) {
        const { type: t, data } = modalApi.getData<Record<string, any>>();
        type.value = t;
        if (t === FormOpenType.EDIT && data) {
          // formApi.setValues(data);
        }
      }
    });
  },
});
</script>

<template>
  <Modal>
    <StepForm />
  </Modal>
</template>

<style scoped></style>
