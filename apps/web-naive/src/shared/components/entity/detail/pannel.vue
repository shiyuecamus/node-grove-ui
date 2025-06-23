<script lang="ts" setup>
import type { EntityType, IdType } from '@vben/types';

import type {
  EntityDetailProps,
  EntityDetailTab,
  ExtendedEntityDetailApi,
} from './types';

import { computed, h, provide, ref, unref, useId, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { usePriorityValues } from '@vben-core/composables';

import { NTabPane, NTabs } from 'naive-ui';

/**
 * 标签内容插槽的参数类型
 */
interface TabSlotProps {
  entityId?: IdType;
  entityType?: EntityType;
}

/**
 * Component props
 */
interface Props extends EntityDetailProps {
  drawerApi?: ExtendedEntityDetailApi;
}

const props = withDefaults(defineProps<Props>(), {
  defaultActiveTab: 'details',
  drawerApi: undefined,
});

// 定义slots
defineSlots<{
  alarms?: (props: TabSlotProps) => any;
  audit?: (props: TabSlotProps) => any;
  details?: (props: TabSlotProps) => any;
  events?: (props: TabSlotProps) => any;
  properties?: (props: TabSlotProps) => any;
  relations?: (props: TabSlotProps) => any;
  telemetry?: (props: TabSlotProps) => any;
}>();

// Generate unique ID
const id = useId();
provide('ENTITY_DETAIL_PANEL_ID', id);

// Set up refs
const contentRef = ref<HTMLElement>();

// Get state from API
const state = props.drawerApi?.useStore?.();

// Extract props with priority from component props and API state
const {
  availableTabs,
  defaultActiveTab,
  detailsComponent,
  entityId,
  entityType,
} = usePriorityValues(props, state);

// Get active tab from state with fallback
const activeTab = computed(
  () => state?.value?.activeTab || defaultActiveTab.value,
);

/**
 * Compute the actual tabs to display based on available tabs
 */
const actualTabs = computed<EntityDetailTab[]>(() => {
  const tabs = availableTabs.value;
  return Array.isArray(tabs)
    ? tabs
    : [
        'details',
        'properties',
        'telemetry',
        'alarms',
        'events',
        'relations',
        'audit',
      ];
});

/**
 * 获取标签对应的图标名称
 */
const getTabIcon = (tab: EntityDetailTab) => {
  const iconMap = {
    details: 'lucide:file-text',
    properties: 'lucide:settings',
    telemetry: 'lucide:line-chart',
    alarms: 'lucide:bell',
    events: 'lucide:calendar-clock',
    relations: 'lucide:network',
    audit: 'lucide:clipboard-list',
  };
  return iconMap[tab];
};

/**
 * Handle tab changes
 * @param value Selected tab value
 */
function handleTabChange(value: string) {
  props.drawerApi?.changeTab(value as EntityDetailTab);
}

// Track if the drawer has been opened
const hasOpened = ref(false);
const isClosed = ref(true);

watch(
  () => state?.value?.isOpen,
  (value) => {
    isClosed.value = false;
    if (value && !unref(hasOpened)) {
      hasOpened.value = true;
    }
  },
);

/**
 * Default tab components map
 */
const defaultTabComponents: Record<
  EntityDetailTab,
  (props: TabSlotProps) => any
> = {
  details: (props) => {
    if (detailsComponent.value) {
      return h(detailsComponent.value, props);
    }
    return h('div', { class: 'p-4' }, [
      h('h3', {}, $t('entity.detail.details')),
    ]);
  },
  properties: () =>
    h('div', { class: 'p-4' }, [h('h3', {}, $t('entity.detail.properties'))]),
  telemetry: () =>
    h('div', { class: 'p-4' }, [h('h3', {}, $t('entity.detail.telemetry'))]),
  alarms: () =>
    h('div', { class: 'p-4' }, [h('h3', {}, $t('entity.detail.alarms'))]),
  events: () =>
    h('div', { class: 'p-4' }, [h('h3', {}, $t('entity.detail.events'))]),
  relations: () =>
    h('div', { class: 'p-4' }, [h('h3', {}, $t('entity.detail.relations'))]),
  audit: () =>
    h('div', { class: 'p-4' }, [h('h3', {}, $t('entity.detail.audit'))]),
};

/**
 * Check if a tab is currently loading
 * @param tab Tab to check
 */
function isTabLoading(tab: EntityDetailTab): boolean {
  return props.drawerApi?.isTabLoading(tab) || false;
}
</script>

<template>
  <div ref="contentRef" class="entity-detail-panel flex h-full flex-col">
    <!-- Tabs navigation -->
    <NTabs
      :default-value="defaultActiveTab"
      v-model:value="activeTab"
      :on-update:value="handleTabChange"
      type="segment"
      :animated="true"
    >
      <NTabPane
        v-for="tab in actualTabs"
        :key="tab"
        :name="tab"
        :tab="
          () =>
            h('div', { class: 'flex items-center' }, [
              h(IconifyIcon, { icon: getTabIcon(tab), class: 'mr-1.5 size-4' }),
              h('span', $t(`entity.detail.${tab}`)),
            ])
        "
        :disabled="isTabLoading(tab)"
      >
        <slot :name="tab" :entity-id="entityId" :entity-type="entityType">
          <component
            :is="defaultTabComponents[tab]"
            :entity-id="entityId"
            :entity-type="entityType"
          />
        </slot>
      </NTabPane>
    </NTabs>
  </div>
</template>

<style scoped>
.entity-detail-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
