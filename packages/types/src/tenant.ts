import type {
  AdditionalInfo,
  BaseEntity,
  ContactInfo,
  IdType,
  StatusInfo,
} from './base';

// TenantInfo interface extends BaseEntity, StatusInfo, and ContactInfo
interface TenantInfo
  extends AdditionalInfo,
    BaseEntity,
    ContactInfo,
    StatusInfo {
  /**
   * 名称
   */
  name?: string;
  /**
   * 域名
   */
  domain?: string[];
  /**
   * 套餐Id
   */
  packageId?: IdType;
}

export type { TenantInfo };
