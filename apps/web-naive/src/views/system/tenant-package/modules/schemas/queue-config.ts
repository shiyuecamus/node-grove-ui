import type { VbenFormProps, VbenFormSchema } from '@vben/common-ui';
import type { VxeGridProps } from '@vben/plugins/vxe-table';
import type { QueueConfiguration } from '@vben/types';

import { h } from 'vue';

import { z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { NGradientText } from 'naive-ui';

import { TableInput } from '#/shared/components/common/table-input';
import {
  createNumberValidation,
  createRequiredStringValidation,
} from '#/shared/composables/use-validation';

import {
  RetryStrategyType,
  RetryStrategyTypeColor,
  RetryStrategyTypeTrans,
  SubmitStrategyType,
  SubmitStrategyTypeColor,
  SubmitStrategyTypeTrans,
} from '../constants';

/**
 * Form schemas for queue configuration
 */
export const queueFormSchema: VbenFormSchema[] = [
  {
    component: 'SubForm',
    hideLabel: true,
    fieldName: 'basicInfo',
    flatten: true,
    componentProps: {
      title: h(
        NGradientText,
        {
          gradient: {
            from: '#2E3192',
            to: '#1BFFFF',
          },
          size: '14',
        },
        {
          default: () =>
            $t('page.system.tenantPackage.queueInfo.group.basicInfo'),
        },
      ),
      defaultExpanded: true,
      wrapperClass: 'grid-cols-1',
      commonConfig: {
        labelClass: 'text-[12px] text-gray-400 w-1/4',
        controlClass: 'w-full',
      },
      schemas: [
        {
          component: 'Input',
          fieldName: 'name',
          label: $t('page.system.tenantPackage.queueInfo.name'),
          componentProps: {
            clearable: true,
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t('page.system.tenantPackage.queueInfo.name'),
            }),
          },
          rules: 'required',
        },
        {
          component: 'Input',
          fieldName: 'topic',
          label: $t('page.system.tenantPackage.queueInfo.topic'),
          componentProps: {
            disabled: true,
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t('page.system.tenantPackage.queueInfo.topic'),
            }),
          },
          dependencies: {
            trigger(values: any, form: any) {
              if (values.name) {
                form.setValues({
                  topic: `ng_rule_engine.${values.name}`,
                });
              }
            },
            triggerFields: ['name'],
          },
          rules: 'required',
        },
      ],
    },
    rules: z.object({
      name: createRequiredStringValidation(
        'page.system.tenantPackage.queueInfo.name',
      ),
      topic: createRequiredStringValidation(
        'page.system.tenantPackage.queueInfo.topic',
      ),
    }),
  },
  {
    component: 'SubForm',
    hideLabel: true,
    fieldName: 'submitSettings',
    flatten: true,
    componentProps: {
      title: h(
        NGradientText,
        {
          gradient: {
            from: '#FF3CAC',
            to: '#784BA0',
          },
          size: '14',
        },
        {
          default: () =>
            $t('page.system.tenantPackage.queueInfo.group.submitSettings'),
        },
      ),
      defaultExpanded: true,
      wrapperClass: 'grid-cols-1',
      commonConfig: {
        labelClass: 'text-[12px] text-gray-400 w-1/4',
        controlClass: 'w-full',
      },
      schemas: [
        {
          component: 'Select',
          fieldName: 'submitStrategy',
          label: $t('page.system.tenantPackage.queueInfo.submitStrategy.title'),
          componentProps: {
            placeholder: $t('ui.placeholder.selectWithName', {
              name: $t(
                'page.system.tenantPackage.queueInfo.submitStrategy.title',
              ),
            }),
            options: [
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.submitStrategy.batch',
                ),
                value: SubmitStrategyType.Batch,
              },
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.submitStrategy.burst',
                ),
                value: SubmitStrategyType.Burst,
              },
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.submitStrategy.sequential',
                ),
                value: SubmitStrategyType.Sequential,
              },
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.submitStrategy.sequentialByOriginator',
                ),
                value: SubmitStrategyType.SequentialByOriginator,
              },
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.submitStrategy.sequentialByTenant',
                ),
                value: SubmitStrategyType.SequentialByTenant,
              },
            ],
          },
          rules: 'required',
        },
        {
          component: 'InputNumber',
          fieldName: 'submitBatchSize',
          label: $t('page.system.tenantPackage.queueInfo.submitBatchSize'),
          componentProps: {
            min: 1,
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t('page.system.tenantPackage.queueInfo.submitBatchSize'),
            }),
          },
          dependencies: {
            show(values: any) {
              return values.submitStrategy === SubmitStrategyType.Batch;
            },
            triggerFields: ['submitStrategy'],
          },
          rules: 'required',
        },
      ],
    },
    rules: z.object({
      submitStrategy: createRequiredStringValidation(
        'page.system.tenantPackage.queueInfo.submitStrategy.title',
        SubmitStrategyType.Batch,
      ),
      submitBatchSize: createNumberValidation(
        'page.system.tenantPackage.queueInfo.submitBatchSize',
        1000,
        1,
      ).optional(),
    }),
  },
  {
    component: 'SubForm',
    hideLabel: true,
    fieldName: 'retryStrategy',
    componentProps: {
      title: h(
        NGradientText,
        {
          gradient: {
            from: '#FFB75E',
            to: '#ED8F03',
          },
          size: '14',
        },
        {
          default: () =>
            $t('page.system.tenantPackage.queueInfo.group.retrySettings'),
        },
      ),
      defaultExpanded: true,
      wrapperClass: 'grid-cols-1',
      commonConfig: {
        labelClass: 'text-[12px] text-gray-400 w-1/4',
        controlClass: 'w-full',
      },
      schemas: [
        {
          component: 'Select',
          fieldName: 'type',
          label: $t('page.system.tenantPackage.queueInfo.retryStrategy.type'),
          componentProps: {
            placeholder: $t('ui.placeholder.selectWithName', {
              name: $t(
                'page.system.tenantPackage.queueInfo.retryStrategy.type',
              ),
            }),
            options: [
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.retryStrategy.retryAll',
                ),
                value: RetryStrategyType.RetryAll,
              },
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.retryStrategy.retryFailed',
                ),
                value: RetryStrategyType.RetryFailed,
              },
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.retryStrategy.retryFailedAndTimeout',
                ),
                value: RetryStrategyType.RetryFailedAndTimeout,
              },
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.retryStrategy.retryTimeout',
                ),
                value: RetryStrategyType.RetryTimeout,
              },
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.retryStrategy.skipAllFailed',
                ),
                value: RetryStrategyType.SkipAllFailed,
              },
              {
                label: $t(
                  'page.system.tenantPackage.queueInfo.retryStrategy.skipAllFailedAndTimeout',
                ),
                value: RetryStrategyType.SkipAllFailedAndTimeout,
              },
            ],
          },
          rules: 'required',
        },
        {
          component: 'InputNumber',
          fieldName: 'retries',
          label: $t(
            'page.system.tenantPackage.queueInfo.retryStrategy.retries',
          ),
          componentProps: {
            min: 0,
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t(
                'page.system.tenantPackage.queueInfo.retryStrategy.retries',
              ),
            }),
          },
          rules: 'required',
        },
        {
          component: 'InputNumber',
          fieldName: 'failurePercentage',
          label: $t(
            'page.system.tenantPackage.queueInfo.retryStrategy.failurePercentage',
          ),
          componentProps: {
            min: 0,
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t(
                'page.system.tenantPackage.queueInfo.retryStrategy.failurePercentage',
              ),
            }),
          },
          rules: 'required',
        },
        {
          component: 'InputNumber',
          fieldName: 'pauseBetweenRetries',
          label: $t(
            'page.system.tenantPackage.queueInfo.retryStrategy.pauseBetweenRetries',
          ),
          componentProps: {
            min: 0,
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t(
                'page.system.tenantPackage.queueInfo.retryStrategy.pauseBetweenRetries',
              ),
            }),
          },
          rules: 'required',
        },
        {
          component: 'InputNumber',
          fieldName: 'maxPauseBetweenRetries',
          label: $t(
            'page.system.tenantPackage.queueInfo.retryStrategy.maxPauseBetweenRetries',
          ),
          componentProps: {
            min: 0,
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t(
                'page.system.tenantPackage.queueInfo.retryStrategy.maxPauseBetweenRetries',
              ),
            }),
          },
          rules: 'required',
        },
      ],
    },
    rules: z.object({
      type: createRequiredStringValidation(
        'page.system.tenantPackage.queueInfo.retryStrategy.type',
        RetryStrategyType.RetryAll,
      ),
      retries: createNumberValidation(
        'page.system.tenantPackage.queueInfo.retryStrategy.retries',
        3,
      ),
      failurePercentage: createNumberValidation(
        'page.system.tenantPackage.queueInfo.retryStrategy.failurePercentage',
        0,
      ),
      pauseBetweenRetries: createNumberValidation(
        'page.system.tenantPackage.queueInfo.retryStrategy.pauseBetweenRetries',
        3,
      ),
      maxPauseBetweenRetries: createNumberValidation(
        'page.system.tenantPackage.queueInfo.retryStrategy.maxPauseBetweenRetries',
        3,
      ),
    }),
  },
  {
    component: 'SubForm',
    hideLabel: true,
    fieldName: 'pollingSettings',
    flatten: true,
    componentProps: {
      title: h(
        NGradientText,
        {
          gradient: {
            from: '#08AEEA',
            to: '#2AF598',
          },
          size: '14',
        },
        {
          default: () =>
            $t('page.system.tenantPackage.queueInfo.group.pollingSettings'),
        },
      ),
      defaultExpanded: true,
      wrapperClass: 'grid-cols-1',
      commonConfig: {
        labelClass: 'text-[12px] text-gray-400 w-1/4',
        controlClass: 'w-full',
      },
      schemas: [
        {
          component: 'InputNumber',
          fieldName: 'pollInterval',
          label: $t('page.system.tenantPackage.queueInfo.pollInterval'),
          help: $t('common.unit.milliseconds'),
          componentProps: {
            min: 0,
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t('page.system.tenantPackage.queueInfo.pollInterval'),
            }),
          },
          rules: 'required',
        },
        {
          component: 'InputNumber',
          fieldName: 'partitions',
          label: $t('page.system.tenantPackage.queueInfo.partitions'),
          componentProps: {
            min: 0,
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t('page.system.tenantPackage.queueInfo.partitions'),
            }),
          },
          rules: 'required',
        },
        {
          component: 'InputNumber',
          fieldName: 'packageProcessingTimeout',
          label: $t(
            'page.system.tenantPackage.queueInfo.packageProcessingTimeout',
          ),
          help: $t('common.unit.milliseconds'),
          componentProps: {
            min: 1,
            placeholder: $t('ui.placeholder.inputWithName', {
              name: $t(
                'page.system.tenantPackage.queueInfo.packageProcessingTimeout',
              ),
            }),
          },
          rules: 'required',
        },
      ],
    },
    rules: z.object({
      pollInterval: createNumberValidation(
        'page.system.tenantPackage.queueInfo.pollInterval',
        25,
      ),
      partitions: createNumberValidation(
        'page.system.tenantPackage.queueInfo.partitions',
        10,
        1,
      ),
      packageProcessingTimeout: createNumberValidation(
        'page.system.tenantPackage.queueInfo.packageProcessingTimeout',
        1000,
      ),
    }),
  },
];

/**
 * Grid columns for queue configuration table
 */
export const queueGridColumns: VxeGridProps<QueueConfiguration>['columns'] = [
  {
    field: 'name',
    title: $t('page.system.tenantPackage.queueInfo.name'),
  },
  {
    field: 'partitions',
    title: $t('page.system.tenantPackage.queueInfo.partitions'),
  },
  {
    field: 'submitStrategy',
    title: $t('page.system.tenantPackage.queueInfo.submitStrategy.title'),
    cellRender: {
      name: 'CellTag',
      options: [
        {
          label: $t(
            SubmitStrategyTypeTrans.get(SubmitStrategyType.Batch) ?? '',
          ),
          value: SubmitStrategyType.Batch,
        },
        {
          label: $t(
            SubmitStrategyTypeTrans.get(SubmitStrategyType.Burst) ?? '',
          ),
          value: SubmitStrategyType.Burst,
        },
        {
          label: $t(
            SubmitStrategyTypeTrans.get(SubmitStrategyType.Sequential) ?? '',
          ),
          value: SubmitStrategyType.Sequential,
        },
        {
          label: $t(
            SubmitStrategyTypeTrans.get(
              SubmitStrategyType.SequentialByOriginator,
            ) ?? '',
          ),
          value: SubmitStrategyType.SequentialByOriginator,
        },
        {
          label: $t(
            SubmitStrategyTypeTrans.get(
              SubmitStrategyType.SequentialByTenant,
            ) ?? '',
          ),
          value: SubmitStrategyType.SequentialByTenant,
        },
      ],
      attrs: {
        color: (value: keyof typeof SubmitStrategyType) => {
          return SubmitStrategyTypeColor.get(value);
        },
      },
    },
  },
  {
    field: 'retryStrategy.type',
    title: $t('page.system.tenantPackage.queueInfo.retryStrategy.type'),
    cellRender: {
      name: 'CellTag',
      options: [
        {
          label: $t(
            RetryStrategyTypeTrans.get(RetryStrategyType.RetryAll) ?? '',
          ),
          value: RetryStrategyType.RetryAll,
        },
        {
          label: $t(
            RetryStrategyTypeTrans.get(RetryStrategyType.RetryFailed) ?? '',
          ),
          value: RetryStrategyType.RetryFailed,
        },
        {
          label: $t(
            RetryStrategyTypeTrans.get(
              RetryStrategyType.RetryFailedAndTimeout,
            ) ?? '',
          ),
          value: RetryStrategyType.RetryFailedAndTimeout,
        },
        {
          label: $t(
            RetryStrategyTypeTrans.get(RetryStrategyType.RetryTimeout) ?? '',
          ),
          value: RetryStrategyType.RetryTimeout,
        },
        {
          label: $t(
            RetryStrategyTypeTrans.get(RetryStrategyType.SkipAllFailed) ?? '',
          ),
          value: RetryStrategyType.SkipAllFailed,
        },
        {
          label: $t(
            RetryStrategyTypeTrans.get(
              RetryStrategyType.SkipAllFailedAndTimeout,
            ) ?? '',
          ),
          value: RetryStrategyType.SkipAllFailedAndTimeout,
        },
      ],
      attrs: {
        color: (value: keyof typeof RetryStrategyType) => {
          return RetryStrategyTypeColor.get(value);
        },
      },
    },
  },
];

/**
 * Form props for queue configuration
 */
export const queueSchema: VbenFormProps = {
  schema: [
    {
      hideLabel: true,
      fieldName: 'packageData.queueConfigurations',
      component: h(TableInput, {
        maxItems: 0,
        gridOptions: {
          pagerConfig: {
            enabled: false,
          },
          toolbarConfig: {},
          columns: queueGridColumns,
        },
        formSchemas: queueFormSchema,
        proxyConfig: {
          enabled: false,
        },
      }),
    },
  ],
  wrapperClass: 'grid-cols-1',
};
