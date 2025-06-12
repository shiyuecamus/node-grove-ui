import type { Component } from 'vue';

import type {
  BaseFormComponentType,
  ExtendedFormApi,
  VbenFormProps,
} from '@vben/common-ui';

// 步骤表单相关类型定义
export interface StepFormState {
  current: number;
  forms: ExtendedFormApi[];
  total: number;
}

export interface ExtendedStepFormApi {
  getStepValues: (step?: number) => Promise<any>;
  getValues: () => Promise<any>;
  goToStep: (step: number) => Promise<void>;
  nextStep: () => Promise<void>;
  prevStep: () => Promise<void>;
  reset: () => void;
  state: StepFormState;
  setStepValues: (step: number, values: any) => Promise<void>;
  setValues: (values: any) => Promise<void>;
  submitAllForms: (merge?: boolean) => Promise<any>;
  validateStep: (step?: number) => Promise<boolean>;
}

export interface StepConfig {
  /** Description for the step */
  description?: string;
  /** Icon for the step */
  icon?: Component | string | undefined;
  /** Title for the step */
  title: Component | string;
}

export interface StepFormProps<
  T extends BaseFormComponentType = BaseFormComponentType,
> {
  actionWrapperClass?: string;
  current?: number;
  forms: VbenFormProps<T>[];
  onComplete?: (allValues: any) => void;
  onStepChange?: (current: number, values: Record<number, any>) => void;
  resetButtonOptions?: Record<string, any>;
  showSteps?: boolean;
  /** Custom stepper component configurations */
  stepConfigs?: StepConfig[];
  /** Custom class for the stepper component */
  stepperClass?: string;
  /** Whether to show the submit button */
  showSubmitButton?: boolean;
  /** Options for the submit button */
  submitButtonOptions?: Record<string, any>;
}

export interface SimpleStepFormProps {
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
}
