import type { VbenFormSchema } from '@vben/common-ui';

import { h } from 'vue';

import { z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { createFormSection } from '#/shared/components/common/sub-form';
import { createNumberValidation } from '#/shared/composables/use-validation';

/**
 * Form schema for resource limits configuration
 */
export const resourceLimitsSchema: VbenFormSchema = createFormSection({
  title: $t('page.system.tenantPackage.resourceLimits.title'),
  icon: 'lucide:database',
  fieldName: 'packageData.resourceLimits',
  extra: h(
    'div',
    { class: 'text-[12px] text-gray-400' },
    { default: () => $t('page.system.tenantPackage.limitsDescription') },
  ),
  schemas: [
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxDevices'),
      fieldName: 'maxDevices',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxDevices'),
        }),
      },
      formItemClass: 'col-span-1',
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxUsers'),
      fieldName: 'maxUsers',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxUsers'),
        }),
      },
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxDrivers'),
      fieldName: 'maxDrivers',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxDrivers'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxProducts'),
      fieldName: 'maxProducts',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxProducts'),
        }),
      },
      rules: 'required',
    },
  ],
  advancedSchemas: [
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxAssets'),
      fieldName: 'maxAssets',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxAssets'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxDepts'),
      fieldName: 'maxDepts',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxDepts'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxRoles'),
      fieldName: 'maxRoles',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxRoles'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.resourceLimits.maxDriversSizeInBytes',
      ),
      help: $t('common.unit.bytes'),
      fieldName: 'maxDriversSizeInBytes',
      component: 'InputNumber',
      componentProps: {
        step: 1024,
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.resourceLimits.maxDriversSizeInBytes',
          ),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxSms'),
      fieldName: 'maxSms',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxSms'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxAlarms'),
      fieldName: 'maxAlarms',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxAlarms'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxDashboards'),
      fieldName: 'maxDashboards',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxDashboards'),
        }),
      },
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxRuleChains'),
      fieldName: 'maxRuleChains',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxRuleChains'),
        }),
      },
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxResources'),
      fieldName: 'maxResources',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxResources'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxResourcesInBytes'),
      help: $t('common.unit.bytes'),
      fieldName: 'maxResourcesInBytes',
      component: 'InputNumber',
      componentProps: {
        step: 1024,
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.resourceLimits.maxResourcesInBytes',
          ),
        }),
      },
      rules: 'required',
    },
    {
      label: $t('page.system.tenantPackage.resourceLimits.maxOtaPackages'),
      fieldName: 'maxOtaPackages',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.resourceLimits.maxOtaPackages'),
        }),
      },
      rules: 'required',
    },
    {
      label: $t(
        'page.system.tenantPackage.resourceLimits.maxOtaPackagesSizeInBytes',
      ),
      help: $t('common.unit.bytes'),
      fieldName: 'maxOtaPackagesSizeInBytes',
      component: 'InputNumber',
      componentProps: {
        step: 1024,
        min: 0,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t(
            'page.system.tenantPackage.resourceLimits.maxOtaPackagesSizeInBytes',
          ),
        }),
      },
      rules: 'required',
    },
  ],
  rules: z.object({
    maxDevices: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxDevices'),
    ),
    maxUsers: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxUsers'),
    ),
    maxDrivers: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxDrivers'),
    ),
    maxProducts: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxProducts'),
    ),
    maxAssets: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxAssets'),
    ),
    maxDepts: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxDepts'),
    ),
    maxRoles: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxRoles'),
    ),
    maxDriversSizeInBytes: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxDriversSizeInBytes'),
      52_428_800,
    ),
    maxSms: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxSms'),
    ),
    maxAlarms: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxAlarms'),
    ),
    maxDashboards: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxDashboards'),
    ),
    maxRuleChains: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxRuleChains'),
    ),
    maxResources: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxResources'),
    ),
    maxResourcesInBytes: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxResourcesInBytes'),
      10_485_760,
    ),
    maxOtaPackages: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxOtaPackages'),
    ),
    maxOtaPackagesSizeInBytes: createNumberValidation(
      $t('page.system.tenantPackage.resourceLimits.maxOtaPackagesSizeInBytes'),
      52_428_800,
    ),
  }),
});
