import type { VbenFormSchema } from '@vben/common-ui';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { createFormSection } from '#/shared/components/common/sub-form';
import { RateLimitInput } from '#/shared/components/limits/rate-limit-input';

/**
 * Form schema for transport limits configuration
 */
export const transportLimitsSchema: VbenFormSchema = createFormSection({
  title: $t('page.system.tenantPackage.transportLimits.title'),
  icon: 'lucide:send',
  fieldName: 'packageData.transportLimits',
  extra: h(
    'div',
    { class: 'text-[12px] text-gray-400' },
    { default: () => $t('page.system.tenantPackage.limitsDescription') },
  ),
  schemas: [
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.tenantMessageRateLimit',
      ),
      fieldName: 'tenantMessageRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.deviceMessageRateLimit',
      ),
      fieldName: 'deviceMessageRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.gatewayMessageRateLimit',
      ),
      fieldName: 'gatewayMessageRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
  ],
  advancedSchemas: [
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.tenantTelemetryMessageRateLimit',
      ),
      fieldName: 'tenantTelemetryMessageRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.tenantTelemetryDataPointsRateLimit',
      ),
      fieldName: 'tenantTelemetryDataPointsRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.deviceTelemetryMessageRateLimit',
      ),
      fieldName: 'deviceTelemetryMessageRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.deviceTelemetryDataPointsRateLimit',
      ),
      fieldName: 'deviceTelemetryDataPointsRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.gatewayTelemetryMessageRateLimit',
      ),
      fieldName: 'gatewayTelemetryMessageRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.gatewayTelemetryDataPointsRateLimit',
      ),
      fieldName: 'gatewayTelemetryDataPointsRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.gatewayDeviceMessageRateLimit',
      ),
      fieldName: 'gatewayDeviceMessageRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.gatewayDeviceTelemetryMessageRateLimit',
      ),
      fieldName: 'gatewayDeviceTelemetryMessageRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
    {
      label: $t(
        'page.system.tenantPackage.transportLimits.gatewayDeviceTelemetryDataPointsRateLimit',
      ),
      fieldName: 'gatewayDeviceTelemetryDataPointsRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
  ],
});
