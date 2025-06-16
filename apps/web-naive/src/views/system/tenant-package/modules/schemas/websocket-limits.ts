import type { VbenFormSchema } from '@vben/common-ui';

import { h } from 'vue';

import { z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { createFormSection } from '#/shared/components/common/sub-form';
import { RateLimitInput } from '#/shared/components/limits/rate-limit-input';
import { createNumberValidation } from '#/shared/composables/use-validation';

/**
 * Form schema for websocket limits configuration
 */
export const websocketLimitsSchema: VbenFormSchema = createFormSection({
  title: $t('page.system.tenantPackage.websocketLimits.title'),
  icon: 'lucide:plug',
  fieldName: 'packageData.websocketLimits',
  extra: h(
    'div',
    { class: 'text-[12px] text-gray-400' },
    { default: () => $t('page.system.tenantPackage.limitsDescription') },
  ),
  schemas: [
    {
      label: $t(
        'page.system.tenantPackage.websocketLimits.maxSessionsPerTenant',
      ),
      fieldName: 'maxSessionsPerTenant',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.websocketLimits.maxSessionsPerTenant',
          ),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.websocketLimits.maxSessionsPerDept'),
      fieldName: 'maxSessionsPerDept',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.websocketLimits.maxSessionsPerDept',
          ),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.websocketLimits.maxSubscriptionsPerTenant',
      ),
      fieldName: 'maxSubscriptionsPerTenant',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.websocketLimits.maxSubscriptionsPerTenant',
          ),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.websocketLimits.maxSubscriptionsPerDept',
      ),
      fieldName: 'maxSubscriptionsPerDept',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.websocketLimits.maxSubscriptionsPerDept',
          ),
        }),
      },
      rules: 'required',
    },
  ],
  advancedSchemas: [
    {
      label: $t(
        'page.system.tenantPackage.websocketLimits.maxSessionsPerRegularUser',
      ),
      fieldName: 'maxSessionsPerRegularUser',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.websocketLimits.maxSessionsPerRegularUser',
          ),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.websocketLimits.maxSessionsPerPublicUser',
      ),
      fieldName: 'maxSessionsPerPublicUser',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.websocketLimits.maxSessionsPerPublicUser',
          ),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.websocketLimits.messageQueueLimitPerSession',
      ),
      fieldName: 'messageQueueLimitPerSession',
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.websocketLimits.messageQueueLimitPerSession',
          ),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.websocketLimits.maxSubscriptionsPerRegularUser',
      ),
      fieldName: 'maxSubscriptionsPerRegularUser',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.websocketLimits.maxSubscriptionsPerRegularUser',
          ),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.websocketLimits.maxSubscriptionsPerPublicUser',
      ),
      fieldName: 'maxSubscriptionsPerPublicUser',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.websocketLimits.maxSubscriptionsPerPublicUser',
          ),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.websocketLimits.updatesPerSessionRateLimit',
      ),
      fieldName: 'updatesPerSessionRateLimit',
      component: h(RateLimitInput, {
        maxItems: 3,
      }),
    },
  ],
  rules: z.object({
    maxSessionsPerTenant: createNumberValidation(
      $t('page.system.tenantPackage.websocketLimits.maxSessionsPerTenant'),
    ),
    maxSessionsPerDept: createNumberValidation(
      $t('page.system.tenantPackage.websocketLimits.maxSessionsPerDept'),
    ),
    maxSubscriptionsPerTenant: createNumberValidation(
      $t('page.system.tenantPackage.websocketLimits.maxSubscriptionsPerTenant'),
    ),
    maxSubscriptionsPerDept: createNumberValidation(
      $t('page.system.tenantPackage.websocketLimits.maxSubscriptionsPerDept'),
    ),
    maxSessionsPerRegularUser: createNumberValidation(
      $t('page.system.tenantPackage.websocketLimits.maxSessionsPerRegularUser'),
    ),
    maxSessionsPerPublicUser: createNumberValidation(
      $t('page.system.tenantPackage.websocketLimits.maxSessionsPerPublicUser'),
    ),
    messageQueueLimitPerSession: createNumberValidation(
      $t(
        'page.system.tenantPackage.websocketLimits.messageQueueLimitPerSession',
      ),
    ),
    maxSubscriptionsPerRegularUser: createNumberValidation(
      $t(
        'page.system.tenantPackage.websocketLimits.maxSubscriptionsPerRegularUser',
      ),
    ),
    maxSubscriptionsPerPublicUser: createNumberValidation(
      $t(
        'page.system.tenantPackage.websocketLimits.maxSubscriptionsPerPublicUser',
      ),
    ),
  }),
});
