import { TagColor } from './color';

export const CommonStatus = {
  /**
   * 禁用
   */
  DISABLED: 1,
  /**
   * 正常
   */
  ENABLED: 0,
} as const;

export const CommonStatusTrans: Map<
  (typeof CommonStatus)[keyof typeof CommonStatus],
  string
> = new Map([
  [CommonStatus.DISABLED, 'common.status.disabled'],
  [CommonStatus.ENABLED, 'common.status.enabled'],
]);

export const CommonStatusColor: Map<
  (typeof CommonStatus)[keyof typeof CommonStatus],
  { borderColor: string; color: string; textColor: string }
> = new Map([
  [CommonStatus.DISABLED, TagColor.Magenta],
  [CommonStatus.ENABLED, TagColor.Cyan],
]);

export enum EntityType {
  /**
   * 部门
   */
  DEPT = 'DEPT',
  /**
   * 设备
   */
  DEVICE = 'DEVICE',
  /**
   * 设备凭证
   */
  DEVICE_CREDENTIALS = 'DEVICE_CREDENTIALS',
  /**
   * 字典
   */
  DICTIONARY = 'DICTIONARY',
  /**
   * 字典详情
   */
  DICTIONARY_DETAIL = 'DICTIONARY_DETAIL',
  /**
   * 驱动
   */
  DRIVER = 'DRIVER',
  /**
   * 厂商
   */
  MANUFACTURER = 'MANUFACTURER',
  /**
   * 菜单
   */
  MENU = 'MENU',
  /**
   * oauth客户端
   */
  OAUTH2_CLIENT = 'OAUTH2_CLIENT',
  /**
   * 操作日志
   */
  OPERATION_RECORD = 'OPERATION_RECORD',
  /**
   * 产品
   */
  PRODUCT = 'PRODUCT',
  /**
   * 角色
   */
  ROLE = 'ROLE',
  /**
   * 菜单
   */
  TENANT = 'TENANT',
  /**
   * 租户套餐
   */
  TENANT_PACKAGE = 'TENANT_PACKAGE',
  /**
   * 用户
   */
  USER = 'USER',
}

interface BaseEntity {
  id: number | string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface TenantModel {
  tenantId?: number | string;
}

interface DeptModel extends TenantModel {
  deptId?: number | string;
}

interface StatusInfo {
  /**
   * 状态
   */
  status?: (typeof CommonStatus)[keyof typeof CommonStatus];
}

/** 联系信息 */
interface ContactInfo {
  /**
   * 国家
   */
  country?: string;
  /**
   * 省/州
   */
  state?: string;
  /**
   * 城市
   */
  city?: string;
  /**
   * 邮编
   */
  zip?: string;
  /**
   * 电话
   */
  phone?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 地址1
   */
  address?: string;
  /**
   * 地址2
   */
  address2?: string;
}

interface AdditionalInfo {
  additionalInfo?: string;
}

export type {
  AdditionalInfo,
  BaseEntity,
  ContactInfo,
  DeptModel,
  StatusInfo,
  TenantModel,
};
