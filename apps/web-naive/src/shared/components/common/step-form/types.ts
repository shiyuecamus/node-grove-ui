import type {
  BaseFormComponentType,
  ExtendedFormApi,
  VbenFormProps,
} from '@vben/common-ui';

// 步骤表单相关类型定义
export interface StepFormState {
  current: number;
  forms: ExtendedFormApi[];
  formValues: Record<number, any>;
  total: number;
}

export interface ExtendedStepFormApi {
  getMergedValues: () => Promise<any>;
  getStepValues: (step?: number) => Promise<any>;
  getValues: () => Promise<any>;
  goToStep: (step: number) => Promise<void>;
  nextStep: () => Promise<void>;
  prevStep: () => Promise<void>;
  reset: () => void;
  state: StepFormState;
  submitAllForms: (merge?: boolean) => Promise<any>;
  validateStep: (step?: number) => Promise<boolean>;
}

export interface StepFormProps<
  T extends BaseFormComponentType = BaseFormComponentType,
> {
  actionWrapperClass?: string;
  current?: number;
  forms: VbenFormProps<T>[];
  mergeValues?: boolean;
  onComplete?: (allValues: any) => void;
  onStepChange?: (current: number, values: Record<number, any>) => void;
  resetButtonOptions?: Record<string, any>;
  showSteps?: boolean;
  /** Custom stepper component configurations */
  stepConfigs?: { description?: string; icon?: any | string; title: string }[];
  /** Custom class for the stepper component */
  stepperClass?: string;
  /** Whether to show the submit button */
  showSubmitButton?: boolean;
  /** Options for the submit button */
  submitButtonOptions?: Record<string, any>;
}
