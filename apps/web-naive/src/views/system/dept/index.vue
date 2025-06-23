<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';
import type { DeptInfo, DeptTree, IdType, Recordable } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { confirm, Page, useVbenDrawer } from '@vben/common-ui';
import { DEFAULT_ROOT_TREE_ID, FormOpenType } from '@vben/constants';
import { useRequestHandler } from '@vben/hooks';
import { $t } from '@vben/locales';
import { CommonStatus, EntityType } from '@vben/types';
import { isEmpty } from '@vben/utils';

import { VbenIcon, VbenTooltip } from '@vben-core/shadcn-ui';

import { NButton, NSwitch, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeDeptStatus,
  createDept,
  deleteDept,
  fetchDeptLazyLoad,
  updateDept,
} from '#/api/core';

import DeptForm from './modules/form.vue';
import { columns, searchFormSchema } from './modules/schemas';

const { handleRequest } = useRequestHandler();

const message = useMessage();

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: true,
  schema: searchFormSchema,
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeGridProps<DeptTree> = {
  columns,
  height: 'auto', // 如果设置为 auto，则必须确保存在父节点且不允许存在相邻元素，否则会出现高度闪动问题
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  rowConfig: {
    keyField: 'id',
  },
  proxyConfig: {
    autoLoad: true,
    response: {
      list: '',
    },
    ajax: {
      query: (_params, formValues) => {
        if (
          isEmpty(formValues.name) &&
          isEmpty(formValues.status) &&
          isEmpty(formValues.startTime) &&
          isEmpty(formValues.endTime)
        ) {
          formValues.parentId = DEFAULT_ROOT_TREE_ID;
        }
        return fetchDeptLazyLoad(formValues);
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: false,
    refresh: { code: 'query' },
    zoom: true,
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: false,
    childrenField: 'children',
    lazy: true,
    hasChildField: 'hasChildren',
    reserve: true,
    loadMethod: ({ row }: { row: DeptTree }) => {
      return fetchDeptLazyLoad({
        parentId: row.id,
      });
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: DeptForm,
});

const handleCreate = () => {
  formDrawerApi
    .setData({
      type: FormOpenType.CREATE,
    })
    .setState({
      title: $t('common.createWithName', {
        name: $t('page.system.dept.title'),
      }),
    })
    .open();
};

const handleEdit = (row: DeptInfo) => {
  formDrawerApi
    .setData({
      type: FormOpenType.EDIT,
      id: row.id,
    })
    .setState({
      title: $t('common.editWithName', {
        name: row.name,
      }),
    })
    .open();
};

const handleDelete = async (row: DeptInfo) => {
  confirm({
    content: $t('common.action.deleteConfirm', {
      entityType: $t(`entity.${EntityType.DEPT.toLowerCase()}`),
      name: row.name,
    }),
    icon: 'warning',
    title: $t('common.tips'),
  })
    .then(async () => {
      await handleRequest(
        () => deleteDept(row.id),
        (_) => {
          message.success(
            $t('common.action.deleteSuccessWithName', { name: row.name }),
          );
        },
      );
      await gridApi.query();
    })
    .catch(() => {});
};

const toggleStatus = async (row: DeptInfo) => {
  const status =
    row.status === CommonStatus.ENABLED
      ? CommonStatus.DISABLED
      : CommonStatus.ENABLED;
  await handleRequest(
    () => changeDeptStatus(row.id, status),
    async (_) => {
      message.success($t('common.action.changeStatusSuccess'));
      await gridApi.query();
    },
  );
};

const handleFormSubmit = async (
  type: FormOpenType,
  id: IdType | undefined,
  values: Recordable<any>,
) => {
  await (type === FormOpenType.CREATE
    ? handleRequest(
        () => createDept(values as DeptInfo),
        (_) => {
          message.success($t('common.action.createSuccess'));
        },
      )
    : handleRequest(
        () =>
          updateDept({
            id,
            ...values,
          } as DeptInfo),
        (_) => {
          message.success($t('common.action.updateSuccess'));
        },
      ));
  await gridApi.query();
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #status="{ row }">
        <NSwitch
          :value="row.status === CommonStatus.ENABLED"
          @update:value="toggleStatus(row)"
        />
      </template>
      <template #toolbar-tools>
        <NButton class="mr-2" type="primary" @click="handleCreate">
          <span>{{
            `${$t('common.createWithName', { name: $t('page.system.dept.title') })}`
          }}</span>
        </NButton>
      </template>
      <template #action="{ row }">
        <VbenTooltip trigger="hover" side="top">
          <template #trigger>
            <NButton
              circle
              size="small"
              tertiary
              type="primary"
              @click.stop="handleEdit(row)"
            >
              <template #icon>
                <VbenIcon icon="lucide:edit" />
              </template>
            </NButton>
          </template>
          {{ $t('common.edit') }}
        </VbenTooltip>
        <VbenTooltip trigger="hover" side="top">
          <template #trigger>
            <NButton
              circle
              size="small"
              tertiary
              type="error"
              @click.stop="handleDelete(row)"
            >
              <template #icon>
                <VbenIcon icon="lucide:trash-2" />
              </template>
            </NButton>
          </template>
          {{ $t('common.delete') }}
        </VbenTooltip>
      </template>
    </Grid>
    <FormDrawer @submit="handleFormSubmit" />
  </Page>
</template>
