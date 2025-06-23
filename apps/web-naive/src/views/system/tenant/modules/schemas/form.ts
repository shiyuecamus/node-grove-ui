import type { VbenFormSchema as FormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { fetchTenantPackageList } from '#/api';
import { contactSchema } from '#/shared/schema/form';

export const formSchema: FormSchema[] = [
  {
    component: 'Input',
    componentProps: {
      clearable: true,
      placeholder: $t('ui.placeholder.inputWithName', {
        name: $t('page.system.tenant.name'),
      }),
    },
    fieldName: 'name',
    label: $t('page.system.tenant.name'),
    rules: 'required',
  },
  {
    component: 'DynamicInput',
    fieldName: 'domain',
    label: $t('page.system.tenant.domain'),
    componentProps: {
      max: 5,
    },
    rules: z
      .array(
        z
          .string()
          .regex(
            /^(?:(?:[a-z0-9-]+\.)+[a-z]{2,}|(?:\d{1,3}\.){3}\d{1,3}(?::\d{1,5})?)$/i,
            $t('errors.invalidDomainOrAddress'),
          ),
      )
      .nonempty({
        message: $t('errors.cannotBeEmptyWithName', {
          name: $t('page.system.tenant.domain'),
        }),
      }),
  },
  {
    component: 'ApiSelect',
    componentProps: {
      api: fetchTenantPackageList,
      clearable: true,
      class: 'w-full',
      filterOption: (input: string, option: Recordable<any>) => {
        return option.name.toLowerCase().includes(input.toLowerCase());
      },
      showSearch: true,
      placeholder: $t('ui.placeholder.selectWithName', {
        name: $t('page.system.tenant.packageId'),
      }),
      labelField: 'name',
      valueField: 'id',
    },
    fieldName: 'packageId',
    label: $t('page.system.tenant.packageId'),
    rules: 'required',
  },
  contactSchema,
];
