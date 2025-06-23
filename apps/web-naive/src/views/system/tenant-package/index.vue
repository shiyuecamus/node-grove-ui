<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';
import type { IdType, Recordable, TenantPackageInfo } from '@vben/types';

import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { confirm, Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { FormOpenType } from '@vben/constants';
import { useRequestHandler } from '@vben/hooks';
import { $t } from '@vben/locales';
import { CommonStatus, EntityType } from '@vben/types';

import { VbenIcon, VbenTooltip } from '@vben-core/shadcn-ui';

import { NButton, NSwitch, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  asignTenantPackageMenu,
  changeTenantPackageStatus,
  createTenantPackage,
  deleteTenantPackage,
  fetchTenantPackagePage,
  updateTenantPackage,
} from '#/api/core';
import { useEntityDetailDrawer } from '#/shared/components/entity/detail';

import AssignMenu from './modules/assign-menu.vue';
import TenantPackageForm from './modules/form.vue';
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

const gridOptions: VxeGridProps<TenantPackageInfo> = {
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
  sortConfig: {
    remote: true,
  },
};

const gridEvents: VxeGridListeners<TenantPackageInfo> = {
  cellClick: ({ row }) => {
    entityDetailDrawerApi.setEntity(EntityType.TENANT_PACKAGE, row.id).open();
  },
  sortChange: async (_params) => {
    // TODO: 排序
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

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: TenantPackageForm,
});

const [EntityDetailDrawer, entityDetailDrawerApi] = useEntityDetailDrawer({
  entityType: EntityType.TENANT_PACKAGE,
});

const handleDelete = async (row: TenantPackageInfo) => {
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
      );
      await gridApi.query();
    })
    .catch(() => {});
};

const handleAssignMenu = (record: Recordable<any>) => {
  assignMenuModalApi
    .setData({
      packageId: record.id,
    })
    .open();
};

const handleAssignMenuSubmit = async (
  packageId: IdType,
  menuIds: Array<IdType>,
) => {
  await handleRequest(
    () => asignTenantPackageMenu(packageId, menuIds),
    (_) => {
      message.success($t('common.action.assignSuccess'));
    },
  );
};

const handleCreate = () => {
  formDrawerApi
    .setData({
      type: FormOpenType.CREATE,
    })
    .setState({
      title: $t('common.createWithName', {
        name: $t('page.system.tenantPackage.title'),
      }),
    })
    .open();
};

const handleEdit = (row: TenantPackageInfo) => {
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

const toggleStatus = async (row: TenantPackageInfo) => {
  const status =
    row.status === CommonStatus.ENABLED
      ? CommonStatus.DISABLED
      : CommonStatus.ENABLED;
  await handleRequest(
    () => changeTenantPackageStatus(row.id, status),
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
        () => createTenantPackage(values as TenantPackageInfo),
        (_) => {
          message.success($t('common.action.createSuccess'));
        },
      )
    : handleRequest(
        () =>
          updateTenantPackage({
            id,
            ...values,
          } as TenantPackageInfo),
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
      <template #toolbar-tools>
        <NButton class="mr-2" type="primary" @click="handleCreate">
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
              type="primary"
              @click.stop="handleAssignMenu(row)"
            >
              <template #icon>
                <VbenIcon icon="lucide:align-horizontal-distribute-center" />
              </template>
            </NButton>
          </template>
          {{ $t('common.asignMenu') }}
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
      <template #status="{ row }">
        <NSwitch
          :value="row.status === CommonStatus.ENABLED"
          @update:value="toggleStatus(row)"
          @click.stop
        />
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
    <FormDrawer @submit="handleFormSubmit" />
  </Page>
</template>
