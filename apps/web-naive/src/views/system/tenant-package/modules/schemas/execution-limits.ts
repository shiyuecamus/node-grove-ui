import type { VbenFormSchema } from '@vben/common-ui';

import { h } from 'vue';

import { z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { createFormSection } from '#/shared/components/common/sub-form';
import { createNumberValidation } from '#/shared/composables/use-validation';

/**
 * Form schema for execution limits configuration
 */
export const executionLimitsSchema: VbenFormSchema = createFormSection({
  title: $t('page.system.tenantPackage.executionLimits.title'),
  icon: 'lucide:play',
  fieldName: 'packageData.executionLimits',
  extra: h(
    'div',
    { class: 'text-[12px] text-gray-400' },
    { default: () => $t('page.system.tenantPackage.limitsDescription') },
  ),
  schemas: [
    {
      label: $t('page.system.tenantPackage.executionLimits.maxRuleEngine'),
      fieldName: 'maxRuleEngine',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.executionLimits.maxRuleEngine'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.executionLimits.maxMessages'),
      fieldName: 'maxMessages',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        defaultValue: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.executionLimits.maxMessages'),
        }),
      },
      rules: 'required',
    },
  ],
  advancedSchemas: [
    {
      label: $t('page.system.tenantPackage.executionLimits.maxDataPoints'),
      fieldName: 'maxDataPoints',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.executionLimits.maxDataPoints'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.executionLimits.maxJs'),
      fieldName: 'maxJs',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.executionLimits.maxJs'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.executionLimits.maxRuleNodePerMessage',
      ),
      fieldName: 'maxRuleNodePerMessage',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.executionLimits.maxRuleNodePerMessage',
          ),
        }),
      },
      rules: 'required',
    },
  ],
  rules: z.object({
    maxRuleEngine: createNumberValidation(
      $t('page.system.tenantPackage.executionLimits.maxRuleEngine'),
    ),
    maxMessages: createNumberValidation(
      $t('page.system.tenantPackage.executionLimits.maxMessages'),
    ),
    maxDataPoints: createNumberValidation(
      $t('page.system.tenantPackage.executionLimits.maxDataPoints'),
    ),
    maxJs: createNumberValidation(
      $t('page.system.tenantPackage.executionLimits.maxJs'),
    ),
    maxRuleNodePerMessage: createNumberValidation(
      $t('page.system.tenantPackage.executionLimits.maxRuleNodePerMessage'),
    ),
  }),
});
