import type { ICity, ICountry, IState } from 'country-state-city';
import type { SelectOption } from 'naive-ui';

import type {
  FormActions,
  VbenFormSchema as FormSchema,
} from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { h } from 'vue';

import { z } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { parsePhoneNumber } from 'awesome-phonenumber';
import { City, Country, State } from 'country-state-city';
import { NGradientText } from 'naive-ui';

export const contactSchema: FormSchema = {
  hideLabel: true,
  fieldName: 'contactInfo',
  flatten: true,
  component: 'SubForm',
  componentProps: {
    title: h('div', { class: 'flex items-center' }, [
      h(IconifyIcon, { icon: 'lucide:user', class: 'mr-1.5 size-4' }),
      h(
        NGradientText,
        {
          gradientType: 'linear',
          from: '#f59e0b',
          to: '#d97706',
        },
        () => $t('common.contactInfo.title'),
      ),
    ]),
    icon: 'lucide:user',
    fieldName: 'contactInfo',
    arrowPlacement: 'right',
    headerClass: 'flex justify-end',
    defaultExpanded: true,
    commonConfig: {
      controlClass: 'w-full',
      labelClass: 'text-[14px] w-1/6',
    },
    wrapperClass: 'grid-cols-1',
    schemas: [
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
          trigger(values: Recordable<any>, form: FormActions) {
            if (!values.country) {
              form.setFieldValue('state', null);
            }
          },
          componentProps(values: Recordable<any>) {
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
          trigger(values: Recordable<any>, form: FormActions) {
            if (!values.country || !values.state) {
              form.setFieldValue('city', null);
            }
          },
          componentProps(values: Recordable<any>) {
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
          clearable: true,
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
        overflow: 'visible',
        componentProps: {
          mode: 'international',
          defaultCountry: 'CN',
          inputOptions: { showDialCode: true, tabindex: 0 },
          dropdownOptions: {
            showSearchBox: true,
            showDialCodeInList: true,
            showFlags: true,
          },
          validCharactersOnly: true,
          placeholder: $t('ui.placeholder.inputWithName', {
            name: $t('common.contactInfo.phone'),
          }),
        },
        rules: z
          .string()
          .refine(
            (value) => {
              // 如果值为空或只包含国家代码（如+86），不进行验证
              if (
                !value ||
                value.trim() === '' ||
                /^\+\d{1,3}$/.test(value.trim())
              ) {
                return true;
              }
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
          clearable: true,
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
          clearable: true,
          type: 'textarea',
          maxlength: 255,
          showCount: true,
          autosize: {
            minRows: 3,
            maxRows: 3,
          },
          inputOptions: {
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t('common.contactInfo.address'),
            }),
          },
        },
      },
      {
        component: 'Input',
        fieldName: 'address2',
        label: $t('common.contactInfo.address2'),
        componentProps: {
          clearable: true,
          type: 'textarea',
          maxlength: 255,
          showCount: true,
          autosize: {
            minRows: 3,
            maxRows: 3,
          },
          placeholder: $t('ui.placeholder.inputWithName', {
            name: $t('common.contactInfo.address2'),
          }),
        },
      },
    ],
  },
};
