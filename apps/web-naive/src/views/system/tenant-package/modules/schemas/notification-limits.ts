import type { VbenFormSchema } from '@vben/common-ui';

import { h } from 'vue';

import { z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { createFormSection } from '#/shared/components/common/sub-form';
import { RateLimitInput } from '#/shared/components/limits/rate-limit-input';
import { createNumberValidation } from '#/shared/composables/use-validation';

/**
 * Form schema for notification limits configuration
 */
export const notificationLimitsSchema: VbenFormSchema = createFormSection({
  title: $t('page.system.tenantPackage.notificationLimits.title'),
  icon: 'lucide:bell',
  fieldName: 'packageData.notificationLimits',
  extra: h(
    'div',
    { class: 'text-[12px] text-gray-400' },
    { default: () => $t('page.system.tenantPackage.limitsDescription') },
  ),
  schemas: [
    {
      label: $t(
        'page.system.tenantPackage.notificationLimits.tenantRequestsRateLimit',
      ),
      fieldName: 'tenantRequestsRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.notificationLimits.tenantRequestsPerRuleRateLimit',
      ),
      fieldName: 'tenantRequestsPerRuleRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t('page.system.tenantPackage.notificationLimits.maxEmails'),
      fieldName: 'maxEmails',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        defaultValue: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.notificationLimits.maxEmails'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.notificationLimits.smsEnabled'),
      fieldName: 'smsEnabled',
      component: 'Switch',
    },
  ],
  rules: z.object({
    maxEmails: createNumberValidation(
      $t('page.system.tenantPackage.notificationLimits.maxEmails'),
    ),
    smsEnabled: z.boolean().default(true),
  }),
});
