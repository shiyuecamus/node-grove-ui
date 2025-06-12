import type { ExtendedFormApi } from '@vben/common-ui';

import type {
  ExtendedStepFormApi,
  StepFormProps,
  StepFormState,
} from './types';

import { markRaw, reactive } from 'vue';

import { Store } from '@vben-core/shared/store';
import { isFunction, mergeWithArrayOverride } from '@vben-core/shared/utils';

export class StepFormApi implements ExtendedStepFormApi {
  public state: StepFormState;
  public store: Store<StepFormProps>;

  constructor(options: StepFormProps) {
    this.store = new Store<StepFormProps>(options);

    this.state = reactive({
      current: options.current || 0,
      total: options.forms.length,
      forms: [],
    });
  }

  addFormApi(formApi: ExtendedFormApi) {
    this.state.forms.push(markRaw(formApi) as unknown as ExtendedFormApi);
  }

  // 获取指定步骤的值
  async getStepValues(step?: number): Promise<any> {
    const stepIndex = step === undefined ? this.state.current : step;
    if (stepIndex < 0 || stepIndex >= this.state.total) return {};

    const formApi = this.state.forms[stepIndex];
    if (!formApi) return {};

    const values = await formApi.getValues();
    return values;
  }

  // 获取所有步骤的值
  async getValues(): Promise<any> {
    let result = {};
    for (const formApi of this.state.forms) {
      const formValues = await formApi.getValues();
      result = mergeWithArrayOverride(formValues, result);
    }
    return result;
  }

  // 跳转到指定步骤
  async goToStep(step: number): Promise<void> {
    if (step < 0 || step >= this.state.total) return;

    // 如果是向前跳转，需要验证当前步骤
    if (step > this.state.current) {
      const isValid = await this.validateStep();
      if (!isValid) return;
    }

    // 切换步骤
    this.state.current = step;
  }

  // 进入下一步
  async nextStep(): Promise<void> {
    if (this.state.current >= this.state.total - 1) return;

    // 验证当前步骤
    const isValid = await this.validateStep();
    if (!isValid) return;

    // 切换到下一步
    this.state.current++;
  }

  // 返回上一步
  async prevStep(): Promise<void> {
    if (this.state.current <= 0) return;

    // 切换到上一步
    this.state.current--;
  }

  // 重置所有表单
  reset(): void {
    this.state.current = 0;

    // 重置所有表单
    this.state.forms.forEach((formApi) => {
      formApi.resetForm();
    });
  }

  setState(
    stateOrFn:
      | ((prev: StepFormProps) => Partial<StepFormProps>)
      | Partial<StepFormProps>,
  ) {
    if (isFunction(stateOrFn)) {
      this.store.setState((prev) => {
        return mergeWithArrayOverride(stateOrFn(prev), prev) as StepFormProps;
      });
    } else {
      this.store.setState(
        (prev) => mergeWithArrayOverride(stateOrFn, prev) as StepFormProps,
      );
    }
  }

  async setStepValues(step: number, values: any) {
    const formApi = this.state.forms[step];
    if (!formApi) return;
    await formApi.setValues(values);
  }

  async setValues(values: any) {
    for (let i = 0; i < this.state.total; i++) {
      await this.setStepValues(i, values);
    }
  }

  // 提交所有表单
  async submitAllForms(): Promise<any> {
    // 验证所有表单
    for (let i = 0; i < this.state.total; i++) {
      const formValid = await this.validateStep(i);
      if (!formValid) {
        this.goToStep(i);
        return null;
      }
    }

    // 获取所有表单的值
    const result = await this.getValues();
    return result;
  }

  // 验证指定步骤
  async validateStep(step?: number): Promise<boolean> {
    const stepIndex = step === undefined ? this.state.current : step;
    if (stepIndex < 0 || stepIndex >= this.state.total) return false;

    const formApi = this.state.forms[stepIndex];
    if (!formApi) return false;

    const result = await formApi.validate();
    return result && result.valid === true;
  }
}
