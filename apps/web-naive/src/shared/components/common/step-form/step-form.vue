<script setup lang="ts">
import type { StepsProps } from 'naive-ui';

import type { ExtendedFormApi } from '@vben/common-ui';

import { computed, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { NButton, NButtonGroup, NStep, NSteps } from 'naive-ui';

export interface StepConfig {
  description?: string;
  icon?: string | typeof IconifyIcon;
  title: string;
}

const props = defineProps<{
  /** Custom class for action wrapper */
  actionWrapperClass?: string;
  /** Current step index (0-based) */
  current: number;
  /** Form APIs for each step */
  formApis: ExtendedFormApi[];
  /** Form components for each step */
  formComponents: any[];
  /** Handler for next step action */
  onNextStep?: () => Promise<void>;
  /** Handler for previous step action */
  onPrevStep?: () => Promise<void>;
  /** Handler for step change */
  onStepChange?: (step: number) => void;
  /** Handler for submitting all forms */
  onSubmitAll?: () => Promise<void>;
  /** Options for the reset/back button */
  resetButtonOptions?: Record<string, any>;
  /** Whether to show the steps navigation */
  showSteps?: boolean;
  /** Whether to show submit button */
  showSubmit?: boolean;
  /** Configuration for each step */
  stepConfigs?: StepConfig[];
  /** Custom class for the stepper */
  stepperClass?: string;
  /** Options for the submit button */
  submitButtonOptions?: Record<string, any>;
}>();

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
        :title="item.title"
        :description="item.description"
      >
        <template v-if="typeof item.icon === 'string'" #icon>
          <IconifyIcon :icon="item.icon" />
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
