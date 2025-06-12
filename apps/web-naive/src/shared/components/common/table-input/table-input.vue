<script lang="ts" setup>
import type { TableInputProps } from './types';

import { computed, nextTick, ref, watch } from 'vue';

import { FormOpenType } from '@vben/constants';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { isEmpty } from '@vben/utils';

import { VbenIcon, VbenTooltip } from '@vben-core/shadcn-ui';

import { NButton, NIcon } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import TableFormInput from './table-form-input.vue';

const props = withDefaults(defineProps<TableInputProps<any>>(), {
  disabled: false,
  maxItems: 10,
  addModalTitle: () => $t('common.create'),
  editModalTitle: () => $t('common.edit'),
  addButtonText: () => $t('common.create'),
  height: 500,
  modalClass: () => 'w-1/2',
});

// Model value binding
const modelValue = defineModel<Record<string, any>[]>({
  default: () => [],
});

// 表单组件引用
const formRef = ref();

watch(
  modelValue,
  async (newVal) => {
    if (!isEmpty(newVal)) {
      await nextTick();
      gridApi.setGridOptions({ data: newVal });
      await gridApi.query();
    }
  },
  {
    immediate: true,
  },
);

// 默认的grid选项
const defaultGridOptions = computed(() => {
  return {
    height: props.height,
    border: true,
    rowConfig: {
      isHover: true,
    },
    checkboxConfig: {
      highlight: true,
    },
    toolbarConfig: {
      refresh: true,
    },
  };
});

// 检查是否需要添加actions列
const processedGridOptions = computed(() => {
  const userOptions = props.gridOptions || {};
  const userColumns = userOptions.columns || [];

  // 检查是否已经包含actions列
  const hasActionsColumn = userColumns.some(
    (col: any) => col.field === 'action' || col.slots?.default === 'action',
  );

  // 如果没有actions列且有用户定义的列，添加一个
  if (!hasActionsColumn && userColumns.length > 0) {
    const actionColumn = {
      title: $t('common.actions'),
      align: 'center',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    };

    return {
      ...userOptions,
      columns: [...userColumns, actionColumn],
    };
  }

  return userOptions;
});

// 合并grid选项
const mergedGridOptions = computed(() => {
  return {
    ...defaultGridOptions.value,
    ...processedGridOptions.value,
    data: modelValue.value,
  };
});

// 使用vxe-grid
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: mergedGridOptions.value as any,
  gridEvents: props.gridEvents,
});

// 添加记录
const handleAdd = () => {
  if (
    props.disabled ||
    (props.maxItems > 0 && modelValue.value.length >= props.maxItems)
  ) {
    return;
  }

  formRef.value?.open(FormOpenType.CREATE);
};

// 编辑记录
const handleEdit = (row: any, rowIndex: number) => {
  if (props.disabled) return;

  formRef.value?.open(FormOpenType.EDIT, row, rowIndex);
};

// 删除记录
const handleDelete = (_row: any, index: number) => {
  if (props.disabled) return;

  const newData = [...modelValue.value];
  newData.splice(index, 1);
  modelValue.value = newData;
};

// 处理表单提交
const handleFormSubmit = (
  type: FormOpenType,
  values: any,
  rowIndex: number,
) => {
  if (type === FormOpenType.EDIT && rowIndex !== -1) {
    // 编辑模式 - 使用传回的索引更新现有记录
    const newData = [...modelValue.value];
    newData[rowIndex] = {
      ...newData[rowIndex],
      ...values,
    };
    modelValue.value = newData;
  } else {
    // 添加模式 - 创建新记录
    modelValue.value = [...modelValue.value, values];
  }
  formRef.value?.close();
};

// 计算是否禁用添加按钮
const disableAdd = computed(() => {
  return (
    props.disabled ||
    (props.maxItems > 0 && modelValue.value.length >= props.maxItems)
  );
});
</script>

<template>
  <div class="w-full">
    <!-- 表格 -->
    <Grid :data="modelValue">
      <!-- 工具栏按钮 -->
      <template #toolbar-tools>
        <div class="mb-2 flex items-center justify-between">
          <NButton
            type="primary"
            size="small"
            :disabled="disableAdd"
            @click="handleAdd"
          >
            <template #icon>
              <NIcon>
                <IconifyIcon icon="lucide:plus" />
              </NIcon>
            </template>
            {{ addButtonText }}
          </NButton>
        </div>
      </template>

      <!-- 操作列 -->
      <template #action="{ row, rowIndex }">
        <VbenTooltip trigger="hover" side="top">
          <template #trigger>
            <NButton
              circle
              size="small"
              tertiary
              type="error"
              @click.stop="handleDelete(row, rowIndex)"
            >
              <template #icon>
                <VbenIcon icon="lucide:trash-2" />
              </template>
            </NButton>
          </template>
          {{ $t('common.delete') }}
        </VbenTooltip>
        <VbenTooltip trigger="hover" side="top">
          <template #trigger>
            <NButton
              circle
              size="small"
              tertiary
              type="primary"
              @click.stop="handleEdit(row, rowIndex)"
            >
              <template #icon>
                <VbenIcon icon="lucide:edit" />
              </template>
            </NButton>
          </template>
          {{ $t('common.edit') }}
        </VbenTooltip>
      </template>
    </Grid>

    <!-- 表单模态框 -->
    <TableFormInput
      ref="formRef"
      :form-schemas="props.formSchemas"
      :modal-class="props.modalClass"
      :add-modal-title="props.addModalTitle"
      :edit-modal-title="props.editModalTitle"
      @submit="handleFormSubmit"
    />
  </div>
</template>
