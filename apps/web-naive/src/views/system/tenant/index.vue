<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';
import type { IdType, Recordable, TenantInfo } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { confirm, Page, useVbenDrawer } from '@vben/common-ui';
import { FormOpenType } from '@vben/constants';
import { useRequestHandler } from '@vben/hooks';
import { $t } from '@vben/locales';
import { CommonStatus, EntityType } from '@vben/types';

import { VbenIcon, VbenTooltip } from '@vben-core/shadcn-ui';

import { NButton, NSwitch, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeTenantStatus,
  createTenant,
  deleteTenant,
  fetchTenantPage,
  updateTenant,
} from '#/api/core';

import TenantForm from './modules/form.vue';
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

const gridOptions: VxeGridProps<TenantInfo> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns,
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

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: TenantForm,
});

const handleCreate = () => {
  formDrawerApi
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

const handleEdit = (row: TenantInfo) => {
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

const handleDelete = async (row: TenantInfo) => {
  confirm({
    content: $t('common.action.deleteConfirm', {
      entityType: $t(`entity.${EntityType.TENANT.toLowerCase()}`),
      name: row.name,
    }),
    icon: 'warning',
    title: $t('common.tips'),
  })
    .then(async () => {
      await handleRequest(
        () => deleteTenant(row.id),
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
  );
};

const handleFormSubmit = async (
  type: FormOpenType,
  id: IdType | undefined,
  values: Recordable<any>,
) => {
  await (type === FormOpenType.CREATE
    ? handleRequest(
        () => createTenant(values as TenantInfo),
        (_) => {
          message.success($t('common.action.createSuccess'));
        },
      )
    : handleRequest(
        () =>
          updateTenant({
            id,
            ...values,
          } as TenantInfo),
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
            `${$t('common.createWithName', { name: $t('page.system.tenant.title') })}`
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
