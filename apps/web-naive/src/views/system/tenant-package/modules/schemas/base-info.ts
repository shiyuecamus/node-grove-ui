import type { VbenFormProps } from '@vben/common-ui';

import { $t } from '@vben/locales';

/**
 * Form schema for basic tenant package information
 */
export const baseInfoSchema: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.name'),
        }),
      },
      fieldName: 'name',
      label: $t('page.system.tenantPackage.name'),
      labelClass: 'text-[14px] w-1/4',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        maxlength: 255,
        showCount: true,
        autosize: {
          minRows: 3,
          maxRows: 3,
        },
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.tenantPackage.description'),
        }),
      },
      fieldName: 'description',
      label: $t('page.system.tenantPackage.description'),
      labelClass: 'text-[14px] w-1/4',
    },
  ],
};
