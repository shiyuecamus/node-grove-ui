<script lang="ts" setup>
import type { Component, VNode } from 'vue';

import type { Recordable } from '@vben/types';

import type { SubFormProps } from './types';

import type { FormCommonConfig } from '#/adapter/form';

import { computed, h, nextTick, watch } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { NCollapse, NCollapseItem, NIcon } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';

const props = withDefaults(defineProps<SubFormProps>(), {
  title: undefined,
  name: undefined,
  defaultExpanded: false,
  extra: undefined,
  arrowIcon: undefined,
  arrowPlacement: 'left',
  layout: 'horizontal',
  disabled: false,
  commonConfig: () => ({}) as FormCommonConfig,
});

const emit = defineEmits(['change', 'blur']);

const modelValue = defineModel<Recordable<any>>({
  default: () => ({}),
});

// Create the form with the provided schemas
const [Form, formApi] = useVbenForm({
  handleValuesChange(values) {
    modelValue.value = values;
    emit('change', values);
  },
  schema: props.schemas,
  wrapperClass: props.wrapperClass,
  layout: props.layout,
  showDefaultActions: false,
  commonConfig: props.commonConfig,
});

// Update form values when model value changes from outside
watch(
  () => modelValue.value,
  async (newVal) => {
    if (newVal) {
      await nextTick();
      await formApi.setValues(newVal);
    }
  },
  { deep: true, immediate: true },
);

/**
 * Renders content as either a string or component
 */
const renderContent = (
  content?: Component | string,
  isIcon = false,
): undefined | VNode => {
  if (!content) return undefined;

  if (typeof content === 'string') {
    // For icons, we need to handle HTML strings as icon content
    if (isIcon) {
      return h(NIcon, null, {
        default: () => h('div', { innerHTML: content }),
      });
    }
    // For regular text content, use a text node
    return h('span', content);
  }

  // Component rendering
  return isIcon ? h(NIcon, null, { default: () => h(content) }) : h(content);
};

// Computed renderers for UI elements
const titleContent = computed(() => renderContent(props.title));
const extraContent = computed(() => renderContent(props.extra));
const arrowContent = computed(() => renderContent(props.arrowIcon, true));

// Panel state
const expandedNames = computed(() =>
  props.defaultExpanded ? [props.name || '1'] : [],
);
const itemName = computed(() => props.name || '1');
</script>

<template>
  <NCollapse
    :default-expanded-names="expandedNames"
    display-directive="show"
    :arrow-placement="props.arrowPlacement"
    class="w-full"
  >
    <template v-if="arrowContent" #arrow>
      <component :is="arrowContent" />
    </template>

    <NCollapseItem :name="itemName" :disabled="disabled">
      <template #header>
        <div :class="cn('flex w-full', headerClass)">
          <component :is="titleContent" />
        </div>
      </template>

      <template v-if="extraContent" #header-extra>
        <div :class="cn('flex w-full', headerExtraClass)">
          <component :is="extraContent" />
        </div>
      </template>

      <div @blur="emit('blur')">
        <Form />
      </div>
    </NCollapseItem>
  </NCollapse>
</template>
<style lang="scss" scoped>
:deep(.n-collapse) {
  .n-collapse-item {
    margin-left: 0 !important;
  }
}
</style>
