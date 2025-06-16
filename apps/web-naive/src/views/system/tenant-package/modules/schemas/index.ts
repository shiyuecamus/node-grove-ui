import type { VbenFormProps } from '@vben/common-ui';

import { apiLimitsSchema } from './api-limits';
import { basicInfoSchema } from './basic-info';
import { edgeLimitsSchema } from './edge-limits';
import { executionLimitsSchema } from './execution-limits';
import { notificationLimitsSchema } from './notification-limits';
import { queueSchema } from './queue-config';
import { resourceLimitsSchema } from './resource-limits';
import { storageTtlSchema } from './storage-ttl';
import { transportLimitsSchema } from './transport-limits';
import { websocketLimitsSchema } from './websocket-limits';

export { searchFormSchema } from './search-form';
export { stepConfigs } from './step-config';
export { columns } from './table-columns';

const limitsSchema: VbenFormProps = {
  schema: [
    resourceLimitsSchema,
    transportLimitsSchema,
    apiLimitsSchema,
    executionLimitsSchema,
    notificationLimitsSchema,
    websocketLimitsSchema,
    edgeLimitsSchema,
    storageTtlSchema,
  ],
  wrapperClass: 'grid-cols-1',
};

export const forms: VbenFormProps[] = [
  basicInfoSchema,
  limitsSchema,
  queueSchema,
];
