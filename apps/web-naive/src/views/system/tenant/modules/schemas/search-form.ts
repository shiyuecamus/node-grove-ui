import type { VbenFormSchema } from '@vben/common-ui';

import { $t } from '@vben/locales';
import { CommonStatus } from '@vben/types';

import { fetchTenantPackageList } from '#/api';

/**
 * Search form schema for tenant package list
 */
export const searchFormSchema: VbenFormSchema[] = [
  {
    component: 'ApiSelect',
    fieldName: 'packageId',
    label: $t('page.system.tenant.packageId'),
    componentProps: {
      clearable: true,
      api: fetchTenantPackageList,
      placeholder: $t('ui.placeholder.select'),
      labelField: 'name',
      valueField: 'id',
    },
  },
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
];
