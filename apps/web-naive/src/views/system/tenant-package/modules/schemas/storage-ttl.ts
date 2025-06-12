import type { VbenFormSchema } from '@vben/common-ui';

import { h } from 'vue';

import { z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { createFormSection } from '#/shared/components/common/sub-form';
import { createNumberValidation } from '#/shared/composables/use-validation';

/**
 * Form schema for storage TTL configuration
 */
export const storageTtlSchema: VbenFormSchema = createFormSection({
  title: $t('page.system.tenantPackage.storageTtl.title'),
  icon: 'lucide:clock',
  fieldName: 'packageData.storageTtl',
  extra: h(
    'div',
    { class: 'text-[12px] text-gray-400' },
    { default: () => $t('page.system.tenantPackage.limitsDescription') },
  ),
  schemas: [
    {
      label: $t('page.system.tenantPackage.storageTtl.defaultTtlDays'),
      fieldName: 'defaultTtlDays',
      component: 'InputNumber',
      help: $t('common.unit.days'),
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.storageTtl.defaultTtlDays'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.storageTtl.alarmsTtlDays'),
      fieldName: 'alarmsTtlDays',
      component: 'InputNumber',
      help: $t('common.unit.days'),
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.storageTtl.alarmsTtlDays'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.storageTtl.rpcTtlDays'),
      fieldName: 'rpcTtlDays',
      component: 'InputNumber',
      help: $t('common.unit.days'),
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.storageTtl.rpcTtlDays'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.storageTtl.queueStatsTtlDays'),
      fieldName: 'queueStatsTtlDays',
      component: 'InputNumber',
      help: $t('common.unit.days'),
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.storageTtl.queueStatsTtlDays'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.storageTtl.ruleEngineExceptionTtlDays',
      ),
      fieldName: 'ruleEngineExceptionTtlDays',
      component: 'InputNumber',
      help: $t('common.unit.days'),
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.storageTtl.ruleEngineExceptionTtlDays',
          ),
        }),
      },
      rules: 'required',
    },
  ],
  rules: z
    .object({
      defaultTtlDays: createNumberValidation(
        'page.system.tenantPackage.storageTtl.defaultTtlDays',
      ),
      rpcTtlDays: createNumberValidation(
        'page.system.tenantPackage.storageTtl.rpcTtlDays',
      ),
      queueStatsTtlDays: createNumberValidation(
        'page.system.tenantPackage.storageTtl.queueStatsTtlDays',
      ),
      ruleEngineExceptionTtlDays: createNumberValidation(
        'page.system.tenantPackage.storageTtl.ruleEngineExceptionTtlDays',
      ),
    })
    .optional(),
});
