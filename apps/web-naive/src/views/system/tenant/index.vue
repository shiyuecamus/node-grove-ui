<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';
import type { TenantInfo } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { FormOpenType } from '@vben/constants';
import { useMessageHandler } from '@vben/hooks';
import { $t } from '@vben/locales';
import { CommonStatus, EntityType } from '@vben/types';

import { VbenIcon } from '@vben-core/shadcn-ui';

import { NButton, NPopconfirm, NSwitch, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeTenantStatus,
  deleteTenant,
  fetchTenantPage,
} from '#/api/core/tenant';

import TenantForm from './modules/form.vue';

const { handleRequest } = useMessageHandler();

const message = useMessage();

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('common.baseInfo.name'),
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        options: [
          {
            label: $t('common.status.enabled'),
            value: CommonStatus.ENABLED,
          },
          {
            label: $t('common.status.disabled'),
            value: CommonStatus.DISABLED,
          },
        ],
        placeholder: $t('ui.placeholder.select'),
      },
      fieldName: 'status',
      label: $t('common.status.title'),
    },
    {
      component: 'DatePicker',
      fieldName: 'startTime',
      label: $t('common.baseInfo.startTime'),
      componentProps: {
        type: 'datetime',
        clearable: true,
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'endTime',
      label: $t('common.baseInfo.endTime'),
      componentProps: {
        type: 'datetime',
        clearable: true,
      },
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeGridProps<TenantInfo> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { field: 'name', title: $t('common.baseInfo.name') },
    { field: 'country', title: $t('common.contactInfo.country') },
    { field: 'state', title: $t('common.contactInfo.state') },
    { field: 'city', title: $t('common.contactInfo.city') },
    {
      field: 'status',
      title: $t('common.status.title'),
      slots: { default: 'status' },
    },
    {
      field: 'createdAt',
      formatter: 'formatDateTime',
      title: $t('common.baseInfo.createdAt'),
    },
    { slots: { default: 'action' }, title: $t('common.actions') },
  ],
  exportConfig: {},
  height: 'auto', // 如果设置为 auto，则必须确保存在父节点且不允许存在相邻元素，否则会出现高度闪动问题
  keepSource: true,
  proxyConfig: {
    autoLoad: true,
    response: {
      result: 'records',
      total: 'total',
      list: 'records',
    },
    ajax: {
      query: async ({ page }, formValues) => {
        return await fetchTenantPage({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    import: true,
    refresh: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [Modal, modalApi] = useVbenModal({
  connectedComponent: TenantForm,
});

const handleCreate = () => {
  modalApi
    .setData({
      type: FormOpenType.CREATE,
    })
    .setState({
      title: $t('common.createWithName', {
        name: $t('page.system.tenant.title'),
      }),
    })
    .open();
};

const handleDelete = async (row: TenantInfo) => {
  await handleRequest(
    () => deleteTenant(row.id),
    (_) => {
      message.success(
        $t('common.action.deleteSuccessWithName', { name: row.name }),
      );
    },
    (_: any) => {
      message.error($t('common.action.deleteFailWithName', { name: row.name }));
    },
  );
  await gridApi.query();
};

const toggleStatus = async (row: TenantInfo) => {
  const status =
    row.status === CommonStatus.ENABLED
      ? CommonStatus.DISABLED
      : CommonStatus.ENABLED;
  await handleRequest(
    () => changeTenantStatus(row.id, status),
    async (_) => {
      message.success($t('common.action.changeStatusSuccess'));
      await gridApi.query();
    },
    (_: any) => {
      message.error($t('common.action.changeStatusFail'));
    },
  );
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
            `${$t('common.createWithName', { name: $t('page.system.tenant.title') })}`
          }}</span>
        </NButton>
      </template>
      <template #action="{ row }">
        <NPopconfirm @positive-click="handleDelete(row)">
          <template #trigger>
            <NButton circle size="small" tertiary type="error">
              <template #icon>
                <VbenIcon icon="lucide:trash-2" />
              </template>
            </NButton>
          </template>
          {{
            $t('common.action.deleteConfirm', {
              entityType: $t(`entity.${EntityType.TENANT.toLowerCase()}`),
              name: row.name,
            })
          }}
        </NPopconfirm>
      </template>
    </Grid>
    <Modal />
  </Page>
</template>
