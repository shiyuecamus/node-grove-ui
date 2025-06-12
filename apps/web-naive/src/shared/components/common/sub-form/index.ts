import type { VbenFormSchema } from '@vben/common-ui';

import type { CreateFormSectionOptions } from './types';

import { h } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { isEmpty } from '@vben/utils';

export { default, default as SubForm } from './sub-form.vue';
export { type CreateFormSectionOptions, type SubFormProps } from './types';

/**
 * Creates a standardized form section with consistent styling and structure
 */
export function createFormSection({
  title,
  icon,
  fieldName,
  schemas,
  defaultExpanded = true,
  advancedSchemas = [],
  extra = undefined,
  rules = undefined,
}: CreateFormSectionOptions): VbenFormSchema {
  const formTitle =
    typeof title === 'string'
      ? h('div', { class: 'flex items-center' }, [
          h(IconifyIcon, { icon, class: 'mr-1.5 size-4' }),
          h('span', title),
        ])
      : title;

  const formSchemas = [...schemas];

  if (!isEmpty(advancedSchemas)) {
    formSchemas.push({
      hideLabel: true,
      fieldName: 'advancedSettings',
      component: 'SubForm',
      flatten: true,
      componentProps: {
        title: $t('common.advancedSettings'),
        defaultExpanded: false,
        arrowPlacement: 'right',
        headerClass: 'flex justify-end',
        wrapperClass: 'grid-cols-1',
        commonConfig: {
          labelClass: 'text-[12px] text-gray-400 w-1/4',
          controlClass: 'w-full',
        },
        schemas: advancedSchemas,
      },
    });
  }

  return {
    component: 'SubForm',
    hideLabel: true,
    fieldName,
    componentProps: {
      title: formTitle,
      extra,
      defaultExpanded,
      wrapperClass: 'grid-cols-1',
      commonConfig: {
        labelClass: 'text-[12px] text-gray-400 w-1/4',
        controlClass: 'w-full',
      },
      schemas: formSchemas,
    },
    rules,
  };
}
