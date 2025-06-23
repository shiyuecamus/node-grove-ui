import type { VxeGridProps } from '@vben/plugins/vxe-table';
import type { TenantInfo } from '@vben/types';

import { $t } from '@vben/locales';

/**
 * Table columns configuration for tenant package list
 */
export const columns: VxeGridProps<TenantInfo>['columns'] = [
  { field: 'name', title: $t('common.baseInfo.name') },
  { field: 'packageName', title: $t('page.system.tenant.packageName') },
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
];
