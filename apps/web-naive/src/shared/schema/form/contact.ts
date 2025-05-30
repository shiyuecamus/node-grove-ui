import type { ICity, ICountry, IState } from 'country-state-city';
import type { SelectOption } from 'naive-ui';

import type { VbenFormSchema as FormSchema } from '@vben/common-ui';

import { h } from 'vue';

import { z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { parsePhoneNumber } from 'awesome-phonenumber';
import { City, Country, State } from 'country-state-city';

export const contactSchema: FormSchema[] = [
  {
    component: 'Select',
    componentProps: {
      clearable: true,
      filterable: true,
      placeholder: $t('ui.placeholder.selectWithName', {
        name: $t('common.contactInfo.country'),
      }),
      renderLabel: (option: SelectOption) => {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
          },
          [
            // 渲染国家旗帜部分
            h(
              'span',
              {
                style: {
                  fontSize: '24px', // 确保旗帜大小合适
                },
              },
              (option.flag as string) || '', // 如果没有 flag，使用空字符串
            ),
            // 渲染国家名称部分
            h('span', {}, option.label as string),
          ],
        );
      },
      options: Country.getAllCountries().map(
        (item: ICountry) =>
          ({
            label: item.name,
            value: item.isoCode,
            flag: item.flag,
          }) as SelectOption,
      ),
    },
    fieldName: 'country',
    label: $t('common.contactInfo.country'),
  },
  {
    component: 'Select',
    componentProps: {
      clearable: true,
      filterable: true,
      placeholder: $t('ui.placeholder.selectWithName', {
        name: $t('common.contactInfo.state'),
      }),
    },
    dependencies: {
      trigger(_, form) {
        form.setFieldValue('state', null);
      },
      componentProps(values) {
        return {
          options:
            State.getStatesOfCountry(values.country)?.map(
              (item: IState) =>
                ({
                  label: item.name,
                  value: item.isoCode,
                }) as SelectOption,
            ) || [],
        };
      },
      triggerFields: ['country'],
    },
    fieldName: 'state',
    label: $t('common.contactInfo.state'),
  },
  {
    component: 'Select',
    componentProps: {
      clearable: true,
      filterable: true,
      placeholder: $t('ui.placeholder.selectWithName', {
        name: $t('common.contactInfo.city'),
      }),
    },
    dependencies: {
      trigger(_, form) {
        form.setFieldValue('city', null);
      },
      componentProps(values) {
        return {
          options:
            City.getCitiesOfState(values.country, values.state ?? '')?.map(
              (item: ICity) =>
                ({
                  label: item.name,
                  value: item.name,
                }) as SelectOption,
            ) || [],
        };
      },
      triggerFields: ['state', 'country'],
    },
    fieldName: 'city',
    label: $t('common.contactInfo.city'),
  },
  {
    component: 'Input',
    fieldName: 'zip',
    label: $t('common.contactInfo.zip'),
    componentProps: {
      placeholder: $t('ui.placeholder.inputWithName', {
        name: $t('common.contactInfo.zip'),
      }),
    },
    rules: z
      .string()
      .min(5, { message: $t('errors.invalidZip') })
      .max(6, { message: $t('errors.invalidZip') })
      .optional(),
  },
  {
    component: 'InputTel',
    fieldName: 'phone',
    label: $t('common.contactInfo.phone'),
    componentProps: {
      mode: 'international',
      defaultCountry: 'CN',
      enabledCountryCode: false,
      showSearchBox: true,
      inputOptions: { showDialCode: true, tabindex: 0 },
      validCharactersOnly: true,
      enabledFlags: false,
      placeholder: $t('ui.placeholder.inputWithName', {
        name: $t('common.contactInfo.phone'),
      }),
    },
    rules: z
      .string()
      .refine(
        (value) => {
          const phone = parsePhoneNumber(value);
          return phone.valid;
        },
        {
          message: $t('errors.invalidPhone'),
        },
      )
      .optional(),
  },
  {
    component: 'Input',
    fieldName: 'email',
    label: $t('common.contactInfo.email'),
    componentProps: {
      placeholder: $t('ui.placeholder.inputWithName', {
        name: $t('common.contactInfo.email'),
      }),
    },
    rules: z
      .string()
      .email({ message: $t('errors.invalidEmail') })
      .optional(),
  },
  {
    component: 'Input',
    fieldName: 'address',
    label: $t('common.contactInfo.address'),
    componentProps: {
      type: 'textarea',
      placeholder: $t('ui.placeholder.inputWithName', {
        name: $t('common.contactInfo.address'),
      }),
    },
  },
  {
    component: 'Input',
    fieldName: 'address2',
    label: $t('common.contactInfo.address2'),
    componentProps: {
      type: 'textarea',
      placeholder: $t('ui.placeholder.inputWithName', {
        name: $t('common.contactInfo.address2'),
      }),
    },
  },
];
