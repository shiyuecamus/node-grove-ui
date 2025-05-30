<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { useMessageHandler } from '@vben/hooks';
import { $t } from '@vben/locales';
import { CommonStatus, EntityType } from '@vben/types';

import { VbenIcon, VbenTooltip } from '@vben-core/shadcn-ui';

import { NButton, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  asignTenantPackageMenu,
  deleteTenantPackage,
  fetchTenantPackagePage,
} from '#/api/core/tenant-package';
import { useEntityDetailDrawer } from '#/shared/components/entity/detail';

import AssignMenu from './modules/assign-menu.vue';

const { handleRequest } = useMessageHandler();

const message = useMessage();

interface RowType {
  id: number | string;
  createdAt: string;
  name: string;
  country: string;
  state: string;
  city: string;
}

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

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { field: 'name', title: $t('common.baseInfo.name') },
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
        return await fetchTenantPackagePage({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    isCurrent: true,
  },
  toolbarConfig: {
    custom: true,
    export: true,
    import: true,
    refresh: true,
    zoom: true,
  },
};

const gridEvents: VxeGridListeners<RowType> = {
  currentRowChange: ({ row }) => {
    entityDetailDrawerApi.setEntity(EntityType.TENANT_PACKAGE, row.id).open();
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridEvents,
  formOptions,
  gridOptions,
});

const [AssignMenuModal, assignMenuModalApi] = useVbenModal({
  connectedComponent: AssignMenu,
});

const [EntityDetailDrawer, entityDetailDrawerApi] = useEntityDetailDrawer({
  entityType: EntityType.TENANT_PACKAGE,
  // defaultActiveTab: 'details',
});

const handleDelete = async (row: RowType) => {
  confirm({
    content: $t('common.action.deleteConfirm', {
      entityType: $t(`entity.${EntityType.TENANT_PACKAGE.toLowerCase()}`),
      name: row.name,
    }),
    icon: 'warning',
    title: $t('common.tips'),
  })
    .then(async () => {
      await handleRequest(
        () => deleteTenantPackage(row.id),
        (_) => {
          message.success(
            $t('common.action.deleteSuccessWithName', { name: row.name }),
          );
        },
        (_: any) => {
          message.error(
            $t('common.action.deleteFailWithName', { name: row.name }),
          );
        },
      );
      await gridApi.query();
    })
    .catch(() => {});
};

const handleAssignMenu = (record: Record<string, any>) => {
  assignMenuModalApi
    .setData({
      packageId: record.id,
    })
    .open();
};

const handleAssignMenuSubmit = async (
  packageId: number | string,
  menuIds: Array<number | string>,
) => {
  await handleRequest(
    () => asignTenantPackageMenu(packageId, menuIds),
    (_) => {
      message.success($t('common.action.assignSuccess'));
    },
  );
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <NButton class="mr-2" type="primary">
          <span>{{
            `${$t('common.createWithName', { name: $t('page.system.tenantPackage.title') })}`
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
              type="error"
              @click="handleDelete(row)"
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
              type="info"
              @click="handleAssignMenu(row)"
            >
              <template #icon>
                <VbenIcon icon="lucide:align-horizontal-distribute-center" />
              </template>
            </NButton>
          </template>
          {{ $t('common.asignMenu') }}
        </VbenTooltip>
      </template>
    </Grid>
    <AssignMenuModal class="w-2/5" @submit="handleAssignMenuSubmit" />
    <EntityDetailDrawer>
      <template #details="{ entityId: eid, entityType }">
        <div class="p-4">
          <h3>租户套餐详情</h3>
          <div>ID: {{ eid }}</div>
          <div>类型: {{ entityType }}</div>
          <!-- 加载更多详情... -->
        </div>
      </template>
      <template #properties="{ entityId: eid, entityType }">
        <div class="p-4">
          <h3>租户套餐详情</h3>
          <div>ID: {{ eid }}</div>
          <div>类型: {{ entityType }}</div>
        </div>
      </template>
    </EntityDetailDrawer>
  </Page>
</template>
