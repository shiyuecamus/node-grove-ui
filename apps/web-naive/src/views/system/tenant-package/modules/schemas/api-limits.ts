import type { VbenFormSchema } from '@vben/common-ui';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { createFormSection } from '#/shared/components/common/sub-form';
import { RateLimitInput } from '#/shared/components/limits/rate-limit-input';

/**
 * Form schema for API limits configuration
 */
export const apiLimitsSchema: VbenFormSchema = createFormSection({
  title: $t('page.system.tenantPackage.apiLimits.title'),
  icon: 'mdi:api',
  fieldName: 'packageData.apiLimits',
  extra: h(
    'div',
    { class: 'text-[12px] text-gray-400' },
    { default: () => $t('page.system.tenantPackage.limitsDescription') },
  ),
  schemas: [
    {
      label: $t(
        'page.system.tenantPackage.apiLimits.tenantServerRestRateLimit',
      ),
      fieldName: 'tenantServerRestRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t('page.system.tenantPackage.apiLimits.deptServerRestRateLimit'),
      fieldName: 'deptServerRestRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.apiLimits.telemetryDbQueryRateLimit',
      ),
      fieldName: 'telemetryDbQueryRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
  ],
});
