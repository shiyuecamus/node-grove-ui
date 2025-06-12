<script setup lang="ts">
import type { StepsProps } from 'naive-ui';

import type { Component, VNode } from 'vue';

import type { SimpleStepFormProps } from './types';

import { computed, h, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { NButton, NButtonGroup, NStep, NSteps } from 'naive-ui';

const props = defineProps<SimpleStepFormProps>();

const emit = defineEmits(['update:current']);

const currentStatus = ref<StepsProps['status']>('process');
const stepperValue = computed(() => props.current + 1);

// 封装对current的读写操作
const currentStep = computed({
  get: () => props.current,
  set: (val) => {
    emit('update:current', val);
    if (props.onStepChange) {
      props.onStepChange(val);
    }
  },
});

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
      return h(IconifyIcon, { icon: content as unknown as string });
    }
    // For regular text content, use a text node
    return h('span', content);
  }

  // Component rendering
  return isIcon
    ? h(IconifyIcon, { icon: content as unknown as string })
    : h(content);
};

/**
 * Generate step configurations based on provided configs or create defaults
 */
const steps = computed(() => {
  if (props.stepConfigs) {
    return props.stepConfigs.map((config, index) => ({
      step: index + 1,
      title: config.title,
      description: config.description || '',
      icon: config.icon || index + 1,
    }));
  }

  return Array.from({ length: props.formComponents.length }, (_, i) => ({
    step: i + 1,
    title: `Step ${i + 1}`,
    description: '',
    icon: i + 1,
  }));
});

/**
 * Handler for the next step action
 */
const handleNextStep = async () => {
  if (props.onNextStep) {
    await props.onNextStep();
  }
};

/**
 * Handler for the previous step action
 */
const handlePrevStep = async () => {
  if (props.onPrevStep) {
    await props.onPrevStep();
  }
};

/**
 * Handler for submitting all forms
 */
const handleSubmitAll = async () => {
  if (props.onSubmitAll) {
    await props.onSubmitAll();
  }
};

// 计算属性用于按钮状态
const isLastStep = computed(
  () => currentStep.value === props.formComponents.length - 1,
);

const isFirstStep = computed(() => currentStep.value === 0);

/**
 * Properties for the previous button
 */
const prevButtonProps = computed(() => ({
  ...props.resetButtonOptions,
  onClick: handlePrevStep,
  disabled: isFirstStep.value,
}));

/**
 * Properties for the next button
 */
const nextButtonProps = computed(() => ({
  ...props.submitButtonOptions,
  onClick: handleNextStep,
  disabled: isLastStep.value,
}));

/**
 * Properties for the submit button
 */
const submitButtonProps = computed(() => ({
  ...props.submitButtonOptions,
  onClick: handleSubmitAll,
}));

// 是否显示提交按钮(默认显示)
const showSubmitButton = computed(
  () => props.showSubmit !== false && isLastStep.value,
);
</script>

<template>
  <div class="w-full">
    <!-- Step navigation -->
    <NSteps
      v-if="props.showSteps"
      :current="stepperValue"
      :status="currentStatus"
      class="w-full"
      :class="[props.stepperClass]"
    >
      <NStep
        v-for="item in steps"
        :key="item.step"
        :description="item.description"
      >
        <!-- Custom title rendering -->
        <template #title>
          <component :is="renderContent(item.title)" />
        </template>

        <!-- Icon rendering -->
        <template #icon>
          <component :is="renderContent(item.icon.toString(), true)" />
        </template>
      </NStep>
    </NSteps>

    <!-- Form content -->
    <div class="w-full pt-8">
      <div
        v-for="(FormComp, index) in props.formComponents"
        :key="index"
        v-show="currentStep === index"
      >
        <component :is="FormComp" />
      </div>
    </div>

    <!-- Form action buttons -->
    <div
      class="mt-5 flex justify-end gap-2"
      :class="[props.actionWrapperClass]"
    >
      <slot
        name="actions"
        :prev-step="handlePrevStep"
        :next-step="handleNextStep"
        :submit-all="handleSubmitAll"
        :is-first-step="isFirstStep"
        :is-last-step="isLastStep"
      >
        <NButtonGroup v-if="!isFirstStep || !isLastStep">
          <NButton v-if="!isFirstStep" v-bind="prevButtonProps">
            {{ $t('common.previous') }}
          </NButton>

          <NButton v-if="!isLastStep" v-bind="nextButtonProps" type="primary">
            {{ $t('common.next') }}
          </NButton>
        </NButtonGroup>

        <NButton
          v-if="showSubmitButton"
          v-bind="submitButtonProps"
          type="primary"
        >
          {{ $t('common.submit') }}
        </NButton>
      </slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.n-steps) {
  .n-step .n-step-indicator {
    background-color: transparent !important;
  }

  .n-step-content {
    .n-step-content__description {
      font-size: 12px;
    }
  }
}
</style>
