import type { BaseEntity, EntityType } from '@vben/types';

import type {
  EntityDetailApiOptions,
  EntityDetailProps,
  EntityDetailState,
  EntityDetailTab,
  EntityId,
  ExtendedEntityDetailApi,
} from './types';

import { defineComponent, h, inject, markRaw } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useStore } from '@vben-core/shared/store';

import { EntityDetailPanel } from '.';

const ENTITY_DETAIL_DRAWER_INJECT_KEY = Symbol(
  'VBEN_ENTITY_DETAIL_DRAWER_INJECT',
);

/**
 * Default props for entity detail panel
 */
const DEFAULT_ENTITY_DETAIL_PROPS: Partial<EntityDetailProps> = {
  showCancelButton: false,
  showConfirmButton: false,
  class: 'w-2/5',
};

/**
 * Set default props for all entity detail panels
 * @param props Default props to set
 */
export function setDefaultEntityDetailProps(props: Partial<EntityDetailProps>) {
  Object.assign(DEFAULT_ENTITY_DETAIL_PROPS, props);
}

/**
 * Hook for using entity detail drawer
 * @param options Configuration options
 * @returns Tuple containing the drawer component and its API
 */
export function useEntityDetailDrawer(options: EntityDetailApiOptions) {
  if (!options.title) {
    // Use a simple default title until we can update it with data
    options.title = $t('entity.detail.detailsWithEntityType', {
      entityType: $t(`entity.${options.entityType.toLowerCase()}`),
    });
  }

  const injectData = inject<any>(ENTITY_DETAIL_DRAWER_INJECT_KEY, {});

  // Merge default props with options
  const mergedOptions = {
    ...DEFAULT_ENTITY_DETAIL_PROPS,
    ...options,
  };

  // Use the VbenDrawer directly
  const [Drawer, drawerApi] = useVbenDrawer(mergedOptions);

  // 扩展API，确保不丢失原有方法
  const entityDetailApi = Object.assign(
    Object.create(Object.getPrototypeOf(drawerApi)),
    drawerApi,
  ) as unknown as ExtendedEntityDetailApi;

  // 添加useStore方法
  entityDetailApi.useStore = (selector) => {
    return useStore(entityDetailApi.store, selector);
  };

  // 添加获取实体数据的方法
  entityDetailApi.getEntityData = function <
    T extends object = BaseEntity,
  >(): T {
    return this.getData<T>();
  };

  // 添加设置实体数据的方法
  entityDetailApi.setEntityData = function <T extends object = BaseEntity>(
    payload: T,
  ): ExtendedEntityDetailApi {
    this.setData(payload);
    // 当数据变化时更新标题
    if (!options.title) {
      this.updateTitle();
    }
    return this;
  };

  // 设置实体类型和ID
  entityDetailApi.setEntity = function (
    entityType: EntityType,
    entityId: EntityId,
  ): ExtendedEntityDetailApi {
    if (this.store?.setState) {
      this.store.setState((prev: EntityDetailState) => ({
        ...prev,
        entityType,
        entityId,
      }));
    }

    // 当实体变化时更新标题
    if (!options.title) {
      this.updateTitle();
    }
    return this;
  };

  // 切换标签页
  entityDetailApi.changeTab = function (
    tab: EntityDetailTab,
  ): ExtendedEntityDetailApi {
    if (this.store?.setState) {
      this.store.setState((prev: EntityDetailState) => ({
        ...prev,
        activeTab: tab,
      }));
    }
    options.onTabChange?.(tab);
    return this;
  };

  // 检查标签页是否加载中
  entityDetailApi.isTabLoading = function (tab: EntityDetailTab): boolean {
    const state = (this.store?.state as EntityDetailState) || {};
    return Boolean(state.tabsLoading?.[tab]);
  };

  // 设置标签页加载状态
  entityDetailApi.setTabLoading = function (
    tab: EntityDetailTab,
    isLoading: boolean,
  ): ExtendedEntityDetailApi {
    if (this.store?.setState) {
      this.store.setState((prev: EntityDetailState) => ({
        ...prev,
        tabsLoading: {
          ...prev.tabsLoading,
          [tab]: isLoading,
        },
      }));
    }
    return this;
  };

  // 更新标题方法
  entityDetailApi.updateTitle = function (): ExtendedEntityDetailApi {
    if (!options.title && this.store) {
      const entityData = this.getEntityData();
      const entityName = entityData?.name;
      const entityType = (this.store.state as EntityDetailState)?.entityType;

      let newTitle: string;

      if (entityName && entityType) {
        newTitle = `${entityName} (${entityType})`;
      } else if (entityType) {
        newTitle = $t('entity.detail.detailsWithEntityType', {
          entityType: $t(`entity.${entityType?.toLowerCase() ?? ''}`),
        });
      }

      if (this.store.setState) {
        this.store.setState((prev: EntityDetailState) => ({
          ...prev,
          title: newTitle,
        }));
      }
    }
    return this;
  };

  // 创建包装后的Drawer组件
  const DetailDrawer = defineComponent({
    name: 'VbenEntityDetailDrawer',
    inheritAttrs: false,
    props: {
      detailsComponent: {
        type: [Object, Function] as any,
        default: undefined,
      },
      // 直接添加其他默认属性
      showCancelButton: Boolean,
      showConfirmButton: Boolean,
    },
    setup(props: any, { attrs, slots }) {
      // 如果提供了自定义组件，优先使用
      if (props.detailsComponent) {
        // 确保组件被标记为raw，避免不必要的响应式
        entityDetailApi.store.setState((prev: EntityDetailState) => ({
          ...prev,
          detailsComponent: markRaw(props.detailsComponent),
        }));
      }

      return () =>
        h(
          Drawer,
          {
            ...attrs,
            drawerApi: entityDetailApi,
          },
          () => [
            h(
              EntityDetailPanel,
              {
                ...props,
                ...attrs,
                drawerApi: entityDetailApi,
              },
              slots,
            ),
          ],
        );
    },
  });

  injectData.extendApi?.(entityDetailApi);

  // 返回带有正确类型的组件和API
  return [DetailDrawer, entityDetailApi] as const;
}
