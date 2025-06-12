import type { VbenFormSchema } from '@vben/common-ui';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { createFormSection } from '#/shared/components/common/sub-form';
import { RateLimitInput } from '#/shared/components/limits/rate-limit-input';

/**
 * Form schema for edge limits configuration
 */
export const edgeLimitsSchema: VbenFormSchema = createFormSection({
  title: $t('page.system.tenantPackage.edgeLimit.title'),
  icon: 'lucide:server',
  fieldName: 'packageData.edgeLimits',
  schemas: [
    {
      label: $t('page.system.tenantPackage.edgeLimit.eventRateLimit'),
      fieldName: 'eventRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t('page.system.tenantPackage.edgeLimit.uplinkMessageRateLimit'),
      fieldName: 'uplinkMessageRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
  ],
  advancedSchemas: [
    {
      label: $t('page.system.tenantPackage.edgeLimit.eventRateLimitPerEdge'),
      fieldName: 'eventRateLimitPerEdge',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.edgeLimit.uplinkMessageRateLimitPerEdge',
      ),
      fieldName: 'uplinkMessageRateLimitPerEdge',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
  ],
});
