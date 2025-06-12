<script lang="ts" setup>
import type { TableFormInputProps } from './types';

import { ref } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { FormOpenType } from '@vben/constants';
import { $t } from '@vben/locales';

const props = withDefaults(defineProps<TableFormInputProps>(), {
  addModalTitle: () => $t('common.create'),
  editModalTitle: () => $t('common.edit'),
  addButtonText: () => $t('common.create'),
  formSchemas: () => [],
  modalClass: () => 'w-1/2',
});

const emit = defineEmits<{
  submit: [FormOpenType, Record<string, any>, number];
  'update:modelValue': [Record<string, any>];
}>();

// 表单状态
const type = ref(FormOpenType.CREATE);
const formData = ref<Record<string, any>>({});
const rowIndex = ref<number>(-1);

// 创建表单
const [Form, formApi] = useVbenForm({
  schema: props.formSchemas,
  showDefaultActions: false,
});

// 创建模态框
const [Modal, modalApi] = useVbenModal({
  destroyOnClose: true,
  class: props.modalClass,
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      const data = modalApi.getData<{
        index: number;
        record?: Record<string, any>;
        type: FormOpenType;
      }>();

      type.value = data.type;
      rowIndex.value = data.index ?? -1;

      modalApi.setState({
        title:
          type.value === FormOpenType.EDIT
            ? props.editModalTitle
            : props.addModalTitle,
      });
      if (type.value === FormOpenType.EDIT && data.record) {
        formApi.setValues(data.record);
        formData.value = data.record;
      } else {
        // 清空表单
        formApi.resetForm();
        formData.value = {};
      }
    }
  },
  onConfirm: async () => {
    try {
      // 手动验证并获取表单值
      const validateResult = await formApi.validate();
      if (Object.keys(validateResult?.errors ?? {}).length > 0) {
        return false;
      }
      const values = await formApi.getValues();
      emit('submit', type.value, values, rowIndex.value);

      return true;
    } catch {
      return false;
    }
  },
});

// 打开模态框的方法（供父组件调用）
const open = (type: FormOpenType, record?: any, index: number = -1) => {
  modalApi
    .setData({
      type,
      record,
      index,
    })
    .open();
};

// 关闭模态框的方法（供父组件调用）
const close = () => {
  modalApi.close();
};

// 暴露方法给父组件
defineExpose({
  open,
  close,
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
