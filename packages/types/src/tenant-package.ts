import type { BaseEntity, StatusInfo } from './base';

import { TagColor } from './color';

// RateLimit interface
interface RateLimit {
  /**
   * 限制的次数
   */
  limit: number;
  /**
   * 时间窗口（秒）
   */
  windowSeconds: number;
}

// SubmitStrategy enum
export const SubmitStrategyType = {
  Batch: 'Batch',
  Burst: 'Burst',
  Sequential: 'Sequential',
  SequentialByOriginator: 'SequentialByOriginator',
  SequentialByTenant: 'SequentialByTenant',
} as const;

export const SubmitStrategyTypeTrans: Map<
  (typeof SubmitStrategyType)[keyof typeof SubmitStrategyType],
  string
> = new Map([
  [
    SubmitStrategyType.Batch,
    'page.system.tenantPackage.queueInfo.submitStrategy.batch',
  ],
  [
    SubmitStrategyType.Burst,
    'page.system.tenantPackage.queueInfo.submitStrategy.burst',
  ],
  [
    SubmitStrategyType.Sequential,
    'page.system.tenantPackage.queueInfo.submitStrategy.sequential',
  ],
  [
    SubmitStrategyType.SequentialByOriginator,
    'page.system.tenantPackage.queueInfo.submitStrategy.sequentialByOriginator',
  ],
  [
    SubmitStrategyType.SequentialByTenant,
    'page.system.tenantPackage.queueInfo.submitStrategy.sequentialByTenant',
  ],
]);

export const SubmitStrategyTypeColor: Map<
  (typeof SubmitStrategyType)[keyof typeof SubmitStrategyType],
  { borderColor: string; color: string; textColor: string }
> = new Map([
  [SubmitStrategyType.Batch, TagColor.Cyan],
  [SubmitStrategyType.Burst, TagColor.Blue],
  [SubmitStrategyType.Sequential, TagColor.Green],
  [SubmitStrategyType.SequentialByOriginator, TagColor.Purple],
  [SubmitStrategyType.SequentialByTenant, TagColor.Orange],
]);

// ProcessingStrategyType enum
export const RetryStrategyType = {
  RetryAll: 'RetryAll',
  RetryFailed: 'RetryFailed',
  RetryFailedAndTimeout: 'RetryFailedAndTimeout',
  RetryTimeout: 'RetryTimeout',
  SkipAllFailed: 'SkipAllFailed',
  SkipAllFailedAndTimeout: 'SkipAllFailedAndTimeout',
} as const;

export const RetryStrategyTypeTrans: Map<
  (typeof RetryStrategyType)[keyof typeof RetryStrategyType],
  string
> = new Map([
  [
    RetryStrategyType.RetryAll,
    'page.system.tenantPackage.queueInfo.retryStrategy.retryAll',
  ],
  [
    RetryStrategyType.RetryFailed,
    'page.system.tenantPackage.queueInfo.retryStrategy.retryFailed',
  ],
  [
    RetryStrategyType.RetryFailedAndTimeout,
    'page.system.tenantPackage.queueInfo.retryStrategy.retryFailedAndTimeout',
  ],
  [
    RetryStrategyType.RetryTimeout,
    'page.system.tenantPackage.queueInfo.retryStrategy.retryTimeout',
  ],
  [
    RetryStrategyType.SkipAllFailed,
    'page.system.tenantPackage.queueInfo.retryStrategy.skipAllFailed',
  ],
  [
    RetryStrategyType.SkipAllFailedAndTimeout,
    'page.system.tenantPackage.queueInfo.retryStrategy.skipAllFailedAndTimeout',
  ],
]);

export const RetryStrategyTypeColor: Map<
  (typeof RetryStrategyType)[keyof typeof RetryStrategyType],
  { borderColor: string; color: string; textColor: string }
> = new Map([
  [RetryStrategyType.RetryAll, TagColor.Cyan],
  [RetryStrategyType.RetryFailed, TagColor.Blue],
  [RetryStrategyType.RetryFailedAndTimeout, TagColor.Green],
  [RetryStrategyType.RetryTimeout, TagColor.Purple],
  [RetryStrategyType.SkipAllFailed, TagColor.Orange],
  [RetryStrategyType.SkipAllFailedAndTimeout, TagColor.Red],
]);

interface RetryStrategy {
  type: (typeof RetryStrategyType)[keyof typeof RetryStrategyType];
  retries: number;
  failurePercentage: number;
  pauseBetweenRetries: number;
  maxPauseBetweenRetries: number;
}

// ResourceLimits interface
interface ResourceLimits {
  /**
   * 最大设备数
   */
  maxDevices?: number;
  /**
   * 最大用户数
   */
  maxUsers?: number;
  /**
   * 最大租户数
   */
  maxTenants?: number;
  /**
   * 最大资产数
   */
  maxAssets?: number;
  /**
   * 最大部门数
   */
  maxDepts?: number;
  /**
   * 最大角色数
   */
  maxRoles?: number;
  /**
   * 最大驱动数
   */
  maxDrivers?: number;
  /**
   * 最大驱动大小（字节）
   */
  maxDriversSizeInBytes?: number;
  /**
   * 最大短信数
   */
  maxSms?: number;
  /**
   * 最大告警数
   */
  maxAlarms?: number;
  /**
   * 最大产品数
   */
  maxProducts?: number;
  /**
   * 最大仪表盘数
   */
  maxDashboards?: number;
  /**
   * 最大规则链数
   */
  maxRuleChains?: number;
  /**
   * 最大资源数
   */
  maxResources?: number;
  /**
   * 最大资源大小（字节）
   */
  maxResourcesInBytes?: number;
  /**
   * 最大OTA包数
   */
  maxOtaPackages?: number;
  /**
   * 最大OTA包大小（字节）
   */
  maxOtaPackagesSizeInBytes?: number;
}

// TransportLimits interface
interface TransportLimits {
  /**
   * 租户消息速率限制
   */
  tenantMessageRateLimit?: RateLimit[];
  /**
   * 租户遥测消息速率限制
   */
  tenantTelemetryMessageRateLimit?: RateLimit[];
  /**
   * 租户遥测数据点速率限制
   */
  tenantTelemetryDataPointsRateLimit?: RateLimit[];
  /**
   * 设备消息速率限制
   */
  deviceMessageRateLimit?: RateLimit[];
  /**
   * 设备遥测消息速率限制
   */
  deviceTelemetryMessageRateLimit?: RateLimit[];
  /**
   * 设备遥测数据点速率限制
   */
  deviceTelemetryDataPointsRateLimit?: RateLimit[];
  /**
   * 最大消息数
   */
  maxMessages?: number;
  /**
   * 最大数据点数
   */
  maxDataPoints?: number;
  /**
   * 最大数据点天数
   */
  maxDataPointsDays?: number;
  /**
   * 每会话最大消息队列限制
   */
  maxMessageQueueLimitPerSession?: number;
}

// ApiLimits interface
interface ApiLimits {
  /**
   * 租户服务器REST速率限制
   */
  tenantServerRestRateLimit?: RateLimit[];
  /**
   * 部门服务器REST速率限制
   */
  deptServerRestRateLimit?: RateLimit[];
  /**
   * 遥测数据库查询速率限制
   */
  telemetryDbQueryRateLimit?: RateLimit[];
}

// ExecutionLimits interface
interface ExecutionLimits {
  /**
   * 最大规则引擎数
   */
  maxRuleEngine?: number;
  /**
   * 最大JS数
   */
  maxJs?: number;
  /**
   * 每消息最大规则节点数
   */
  maxRuleNodePerMessage?: number;
}

// NotificationLimits interface
interface NotificationLimits {
  /**
   * 租户请求速率限制
   */
  tenantRequestsRateLimit?: RateLimit[];
  /**
   * 每规则租户请求速率限制
   */
  tenantEquestsPerRuleRateLimit?: RateLimit[];
  /**
   * 最大邮件数
   */
  maxEmails?: number;
  /**
   * 短信是否启用
   */
  smsEnabled?: boolean;
}

// WebsocketLimits interface
interface WebsocketLimits {
  /**
   * 每租户最大会话数
   */
  maxSessionsPerTenant?: number;
  /**
   * 每部门最大会话数
   */
  maxSessionsPerDept?: number;
  /**
   * 每常规用户最大会话数
   */
  maxSessionsPerRegularUser?: number;
  /**
   * 每公共用户最大会话数
   */
  maxSessionsPerPublicUser?: number;
  /**
   * 每租户最大订阅数
   */
  maxSubscriptionsPerTenant?: number;
  /**
   * 每部门最大订阅数
   */
  maxSubscriptionsPerDept?: number;
  /**
   * 每常规用户最大订阅数
   */
  maxSubscriptionsPerRegularUser?: number;
  /**
   * 每公共用户最大订阅数
   */
  maxSubscriptionsPerPublicUser?: number;
  /**
   * 每会话更新速率限制
   */
  updatesPerSessionRateLimit?: RateLimit[];
}

// EdgeLimit interface
interface EdgeLimit {
  /**
   * 事件速率限制
   */
  eventRateLimit?: RateLimit[];
  /**
   * 每边缘事件速率限制
   */
  eventRateLimitPerEdge?: RateLimit[];
  /**
   * 上行消息速率限制
   */
  uplinkMessageRateLimit?: RateLimit[];
  /**
   * 每边缘上行消息速率限制
   */
  uplinkMessageRateLimitPerEdge?: RateLimit[];
}

// StorageTtl interface
interface StorageTtl {
  /**
   * 默认TTL天数
   */
  defaultTtlDays?: number;
  /**
   * 告警TTL天数
   */
  alarmsTtlDays?: number;
  /**
   * RPC TTL天数
   */
  rpcTtlDays?: number;
  /**
   * 队列统计TTL天数
   */
  queueStatsTtlDays?: number;
  /**
   * 规则引擎异常TTL天数
   */
  ruleEngineExceptionTtlDays?: number;
}

// QueueConfiguration interface
interface QueueConfiguration {
  /**
   * 名称
   */
  name: string;
  /**
   * 主题
   */
  topic: string;
  /**
   * 轮询间隔
   */
  pollInterval: number;
  /**
   * 分区
   */
  partitions: number;
  /**
   * 每分区部门
   */
  deptPerPartition: number;
  /**
   * 包处理超时
   */
  packageProcessingTimeout: number;
  /**
   * 提交策略
   */
  submitStrategy: (typeof SubmitStrategyType)[keyof typeof SubmitStrategyType];
  /**
   * 提交批量大小
   */
  submitBatchSize: number;
  /**
   * 处理策略
   */
  retryStrategy: RetryStrategy;
}

// TenantPackageData interface
interface TenantPackageData {
  /**
   * 资源限制
   */
  resourceLimits?: ResourceLimits;
  /**
   * 传输限制
   */
  transportLimits?: TransportLimits;
  /**
   * API限制
   */
  apiLimits?: ApiLimits;
  /**
   * 执行限制
   */
  executionLimits?: ExecutionLimits;
  /**
   * 通知限制
   */
  notificationLimits?: NotificationLimits;
  /**
   * WebSocket限制
   */
  websocketLimits?: WebsocketLimits;
  /**
   * 边缘限制
   */
  edgeLimits?: EdgeLimit;
  /**
   * 存储TTL
   */
  storageTtl?: StorageTtl;
  /**
   * 队列配置
   */
  queueConfigurations?: QueueConfiguration[];
}

// TenantPackageInfo interface extends BaseEntity, StatusInfo
interface TenantPackageInfo extends BaseEntity, StatusInfo {
  /**
   * 名称
   */
  name?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 套餐数据
   */
  packageData: TenantPackageData;
}

export type {
  ApiLimits,
  EdgeLimit,
  ExecutionLimits,
  NotificationLimits,
  QueueConfiguration,
  RateLimit,
  ResourceLimits,
  RetryStrategy,
  StorageTtl,
  TenantPackageData,
  TenantPackageInfo,
  TransportLimits,
  WebsocketLimits,
};
