import type { VbenFormSchema as FormSchema } from '@vben/common-ui';

import { $t } from '@vben/locales';

import { fetchDeptAllTree } from '#/api';
import { createNumberValidation } from '#/shared/composables/use-validation';
import { contactSchema } from '#/shared/schema/form';

export const useFormSchema = (): FormSchema[] => {
  return [
    {
      component: 'Input',
      componentProps: {
        clearable: true,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.dept.name'),
        }),
      },
      fieldName: 'name',
      label: $t('page.system.dept.name'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        clearable: true,
        placeholder: $t('ui.placeholder.inputWithName', {
          name: $t('page.system.dept.sort'),
        }),
      },
      fieldName: 'sort',
      label: $t('page.system.dept.sort'),
      rules: createNumberValidation($t('page.system.dept.sort'), 1),
    },
    // render-tag	(props: { option: TreeSelectOption, handleClose: () => void }) => VNodeChild
    {
      component: 'ApiTreeSelect',
      componentProps: {
        api: fetchDeptAllTree,
        clearable: true,
        class: 'w-full',
        filterable: true,
        placeholder: $t('ui.placeholder.selectWithName', {
          name: $t('page.system.dept.parentId'),
        }),
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        defaultExpandAll: true,
      },
      fieldName: 'parentId',
      label: $t('page.system.dept.parentId'),
      rules: 'required',
    },
    contactSchema,
  ];
};

export const formSchema: FormSchema[] = [];
