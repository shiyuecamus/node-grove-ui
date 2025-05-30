/**
 * 实体详情面板组件和相关工具
 *
 * @module components/entity/detail
 */

// 导出主要组件
export { default as EntityDetailPanel } from './pannel.vue';

// 导出类型定义
export * from './types';

// 导出API和工具函数
export {
  setDefaultEntityDetailProps,
  useEntityDetailDrawer,
} from './use-drawer';
