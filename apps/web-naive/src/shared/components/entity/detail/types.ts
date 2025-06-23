import type { Component, Ref } from 'vue';

import type {
  DrawerApi,
  DrawerApiOptions,
  DrawerProps,
  DrawerState,
} from '@vben/common-ui';
import type { BaseEntity, EntityType, IdType } from '@vben/types';

/**
 * Available tabs in entity detail panel
 */
export type EntityDetailTab =
  | 'alarms'
  | 'audit'
  | 'details'
  | 'events'
  | 'properties'
  | 'relations'
  | 'telemetry';

/**
 * Entity identifier
 */
export type EntityId = IdType;

/**
 * Entity detail panel props
 */
export interface EntityDetailProps extends DrawerProps {
  /**
   * Entity type identifier
   */
  entityType?: EntityType;

  /**
   * Entity identifier
   */
  entityId?: EntityId;

  /**
   * Available tabs to show
   * @default all tabs
   */
  availableTabs?: EntityDetailTab[];

  /**
   * Default active tab
   * @default 'details'
   */
  defaultActiveTab?: EntityDetailTab;

  /**
   * Custom component for details tab
   */
  detailsComponent?: Component;

  /**
   * Custom class for content
   */
  contentClass?: string;
}

/**
 * Entity detail panel state
 */
export interface EntityDetailState extends DrawerState {
  /**
   * Entity type identifier
   */
  entityType?: EntityType;

  /**
   * Entity identifier
   */
  entityId?: EntityId;

  /**
   * Available tabs to show
   */
  availableTabs?: EntityDetailTab[];

  /**
   * Default active tab
   */
  defaultActiveTab?: EntityDetailTab;

  /**
   * Custom component for details tab
   */
  detailsComponent?: Component;

  /**
   * Currently active tab
   */
  activeTab?: EntityDetailTab;

  /**
   * Loading state for specific tabs
   */
  tabsLoading?: Partial<Record<EntityDetailTab, boolean>>;
}

/**
 * 扩展的实体详情API，在DrawerApi基础上增加实体相关方法
 */
export interface ExtendedEntityDetailApi extends DrawerApi {
  /**
   * 切换活动标签页
   * @param tab 目标标签页
   */
  changeTab: (tab: EntityDetailTab) => ExtendedEntityDetailApi;

  /**
   * 获取实体数据
   * @template T 返回数据类型
   */
  getEntityData: <T extends object = BaseEntity>() => T;

  /**
   * 检查标签页是否正在加载
   * @param tab 标签页
   */
  isTabLoading: (tab: EntityDetailTab) => boolean;

  /**
   * 设置实体类型和ID
   * @param entityType 实体类型
   * @param entityId 实体ID
   */
  setEntity: (
    entityType: EntityType,
    entityId: EntityId,
  ) => ExtendedEntityDetailApi;

  /**
   * 设置实体数据
   * @param payload 实体数据
   * @template T 实体数据类型
   */
  setEntityData: <T extends object = BaseEntity>(
    payload: T,
  ) => ExtendedEntityDetailApi;

  /**
   * 设置标签页加载状态
   * @param tab 标签页
   * @param isLoading 是否加载中
   */
  setTabLoading: (
    tab: EntityDetailTab,
    isLoading: boolean,
  ) => ExtendedEntityDetailApi;

  /**
   * 更新抽屉标题（根据实体数据）
   */
  updateTitle: () => ExtendedEntityDetailApi;

  /**
   * 访问状态存储，可选择器
   * @param selector 选择器函数
   * @template T 返回数据类型
   */
  useStore: <T = EntityDetailState>(
    selector?: (state: EntityDetailState) => T,
  ) => Readonly<Ref<T>>;
}

/**
 * 实体详情API选项
 */
export interface EntityDetailApiOptions extends DrawerApiOptions {
  /**
   * 实体类型标识
   */
  entityType: EntityType;

  /**
   * 实体标识
   */
  entityId?: EntityId;

  /**
   * 可用标签页
   */
  availableTabs?: EntityDetailTab[];

  /**
   * 默认活动标签页
   */
  defaultActiveTab?: EntityDetailTab;

  /**
   * 自定义详情标签页组件
   */
  detailsComponent?: Component;

  /**
   * 标签页变更回调
   * @param tab 新选中的标签页
   */
  onTabChange?: (tab: EntityDetailTab) => void;
}
