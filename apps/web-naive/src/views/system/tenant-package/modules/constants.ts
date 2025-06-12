import { $t } from '@vben/locales';
import {
  CommonStatus,
  RetryStrategyType,
  RetryStrategyTypeColor,
  RetryStrategyTypeTrans,
  SubmitStrategyType,
  SubmitStrategyTypeColor,
  SubmitStrategyTypeTrans,
} from '@vben/types';

// Options for retry strategy select
export const retryStrategyOptions = [
  {
    label: $t('page.system.tenantPackage.queueInfo.retryStrategy.retryAll'),
    value: RetryStrategyType.RetryAll,
  },
  {
    label: $t('page.system.tenantPackage.queueInfo.retryStrategy.retryFailed'),
    value: RetryStrategyType.RetryFailed,
  },
  {
    label: $t(
      'page.system.tenantPackage.queueInfo.retryStrategy.retryFailedAndTimeout',
    ),
    value: RetryStrategyType.RetryFailedAndTimeout,
  },
  {
    label: $t('page.system.tenantPackage.queueInfo.retryStrategy.retryTimeout'),
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
];

// Options for submit strategy select
export const submitStrategyOptions = [
  {
    label: $t('page.system.tenantPackage.queueInfo.submitStrategy.batch'),
    value: SubmitStrategyType.Batch,
  },
  {
    label: $t('page.system.tenantPackage.queueInfo.submitStrategy.burst'),
    value: SubmitStrategyType.Burst,
  },
  {
    label: $t('page.system.tenantPackage.queueInfo.submitStrategy.sequential'),
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
];

// Options for status select
export const statusOptions = [
  {
    label: $t('common.status.enabled'),
    value: CommonStatus.ENABLED,
  },
  {
    label: $t('common.status.disabled'),
    value: CommonStatus.DISABLED,
  },
];

// Export constants from imports
export {
  RetryStrategyType,
  RetryStrategyTypeColor,
  RetryStrategyTypeTrans,
  SubmitStrategyType,
  SubmitStrategyTypeColor,
  SubmitStrategyTypeTrans,
};
