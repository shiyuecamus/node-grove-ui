<script lang="ts" setup>
import type { Component } from 'vue';

import type { SubFormProps } from './types';

import { computed, h, watch } from 'vue';

import { NCollapse, NCollapseItem, NIcon } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';

const props = withDefaults(defineProps<SubFormProps>(), {
  title: undefined,
  name: undefined,
  defaultExpanded: false,
  extra: undefined,
  extraComponent: undefined,
  arrowIcon: undefined,
  arrowComponent: undefined,
  wrapperClass: 'grid-cols-1',
  layout: 'horizontal',
  disabled: false,
});

const emit = defineEmits(['change', 'blur']);

const modelValue = defineModel<Record<string, any>>({
  default: () => ({
    a: 1,
  }),
});

// Create the form with the provided schemas
const [Form, formApi] = useVbenForm({
  schema: props.schemas,
  wrapperClass: props.wrapperClass,
  layout: props.layout,
  showDefaultActions: false,
});

// Sync the model value with the form
formApi.useStore((state: any) => {
  if (state.values) {
    modelValue.value = { ...state.values };
    emit('change', modelValue.value);
  }
});

// Update form values when model value changes
const setFormValues = () => {
  if (Object.keys(modelValue.value || {}).length > 0) {
    formApi.setValues(modelValue.value);
  }
};

// Watch for external changes to model value
watch(
  () => modelValue.value,
  () => {
    setFormValues();
  },
  { deep: true, immediate: true },
);

// Create extra component or text for the header
const headerExtra = computed(() => {
  if (props.extraComponent) {
    return () => h(props.extraComponent as Component);
  } else if (props.extra) {
    return () => props.extra;
  }
  return undefined;
});

// Create arrow component or icon for the collapse
const arrow = computed(() => {
  if (props.arrowComponent) {
    return () =>
      h(NIcon, null, { default: () => h(props.arrowComponent as Component) });
  } else if (props.arrowIcon) {
    return () =>
      h(NIcon, null, {
        default: () => h('div', { innerHTML: props.arrowIcon }),
      });
  }
  return undefined;
});

// Handle form blur events
const handleBlur = () => {
  emit('blur');
};
</script>

<template>
  <NCollapse :default-expanded-names="defaultExpanded ? [name || '1'] : []">
    <template v-if="arrow" #arrow>
      <component :is="arrow()" />
    </template>

    <NCollapseItem :name="name || '1'" :title="title" :disabled="disabled">
      <template v-if="headerExtra" #header-extra>
        <component :is="headerExtra()" />
      </template>

      <div @blur="handleBlur">
        <Form />
      </div>
    </NCollapseItem>
  </NCollapse>
</template>
