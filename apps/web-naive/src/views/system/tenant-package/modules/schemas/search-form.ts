import type { VbenFormSchema } from '@vben/common-ui';

import { $t } from '@vben/locales';

import { statusOptions } from '../constants';

/**
 * Search form schema for tenant package list
 */
export const searchFormSchema: VbenFormSchema[] = [
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
      options: statusOptions,
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
