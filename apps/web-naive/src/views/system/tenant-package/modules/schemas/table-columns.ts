import type { VxeGridProps } from '@vben/plugins/vxe-table';

import { $t } from '@vben/locales';

/**
 * Table columns configuration for tenant package list
 */
export const columns: VxeGridProps<any>['columns'] = [
  { field: 'name', title: $t('common.baseInfo.name') },
  { field: 'description', title: $t('common.baseInfo.description') },
  {
    field: 'status',
    title: $t('common.status.title'),
    slots: { default: 'status' },
  },
  {
    field: 'createdAt',
    formatter: 'formatDateTime',
    title: $t('common.baseInfo.createdAt'),
    sortable: true,
  },
  { slots: { default: 'action' }, title: $t('common.actions') },
];
