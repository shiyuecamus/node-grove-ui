import type {
  AdditionalInfo,
  BaseEntity,
  ContactInfo,
  IdType,
  StatusInfo,
} from './base';

// DeptInfo interface extends BaseEntity, StatusInfo, and ContactInfo
interface DeptInfo extends AdditionalInfo, BaseEntity, ContactInfo, StatusInfo {
  /**
   * 名称
   */
  name?: string;
  /**
   * 父级ID
   */
  parentId?: IdType;
  /**
   * 排序
   */
  sort?: number;
}

/**
 * DeptTree extends DeptInfo and has children and hasChildren properties
 */
interface DeptTree extends DeptInfo {
  children: DeptTree[];
  hasChildren: boolean;
  isLeaf: boolean;
}

/**
 * DeptTreeWithLeaf extends DeptTree and has isLeaf property
 */
interface DeptTreeWithLeaf extends DeptTree {
  isLeaf: boolean;
}

export type { DeptInfo, DeptTree, DeptTreeWithLeaf };
