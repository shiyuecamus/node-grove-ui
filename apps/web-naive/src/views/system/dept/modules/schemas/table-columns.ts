import type { VxeGridProps } from '@vben/plugins/vxe-table';
import type { DeptTree } from '@vben/types';

import { $t } from '@vben/locales';

/**
 * Table columns configuration for tenant package list
 */

export const columns: VxeGridProps<DeptTree>['columns'] = [
  {
    field: 'name',
    title: $t('page.system.dept.name'),
    treeNode: true,
    width: 150,
  },
  { field: 'sort', title: $t('page.system.dept.sort') },
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
