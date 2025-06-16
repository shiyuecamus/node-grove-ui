import type { ExtendedFormApi } from '@vben/common-ui';

import type {
  ExtendedStepFormApi,
  StepFormProps,
  StepFormState,
} from './types';

import { markRaw, reactive } from 'vue';

import { Store } from '@vben-core/shared/store';
import {
  isFunction,
  isObject,
  mergeWithArrayOverride,
} from '@vben-core/shared/utils';

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

    // 先获取每个步骤表单的schema，用于识别该表单负责的字段
    const formSchemas = this.store.state.forms.map(
      (form) => form?.schema || [],
    );

    // 遍历每个步骤的表单
    for (let i = 0; i < this.state.forms.length; i++) {
      const formApi = this.state.forms[i];
      if (!formApi) continue;

      const formValues = await formApi.getValues();
      const currentSchema = formSchemas[i] || [];

      // 如果当前步骤没有schema，直接合并整个值对象
      if (currentSchema.length === 0) {
        result = this.deepMergeWithPriority(result, formValues);
        continue;
      }

      // 获取当前步骤负责的字段
      const { responsibleFields } =
        this.analyzeFormResponsibility(currentSchema);

      // 按字段有选择性地合并值
      result = this.mergeFieldsByResponsibility(
        result,
        formValues,
        responsibleFields,
      );
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

  async setStepValues(step: number, values: Record<string, any>) {
    const formApi = this.state.forms[step];
    if (!formApi) return;
    await formApi.setValues(values);
  }

  async setValues(values: Record<string, any>) {
    if (!values) return;

    for (let i = 0; i < this.state.total; i++) {
      const formApi = this.state.forms[i];
      if (!formApi) continue;

      // 获取当前表单的schema
      const formSchema = this.store.state.forms[i]?.schema || [];

      // 如果没有schema或schema为空，则直接设置整个值
      if (!formSchema || formSchema.length === 0) {
        await this.setStepValues(i, values);
        continue;
      }

      // 分析表单schema，识别顶层字段和扁平化字段
      const { directFields, flattenFields } =
        this.analyzeStepFormSchema(formSchema);

      // 构建当前步骤表单所需的数据
      const formValues = this.extractStepFormData(
        values,
        directFields,
        flattenFields,
      );
      // 设置表单值
      await this.setStepValues(i, formValues);
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

  /**
   * 分析表单负责的字段范围
   * 包括处理子表单和扁平化字段
   */
  private analyzeFormResponsibility(schema: any[]): {
    responsibleFields: Set<string>;
  } {
    const responsibleFields = new Set<string>();

    const processField = (fieldName: string) => {
      if (!fieldName) return;

      // 处理嵌套路径，如 'packageData.resourceLimits'
      const parts = fieldName.split('.');

      // 添加完整路径
      responsibleFields.add(fieldName);

      // 添加每一级路径
      let currentPath = '';
      for (const part of parts) {
        currentPath = currentPath ? `${currentPath}.${part}` : part;
        responsibleFields.add(currentPath);
      }
    };

    const processSchema = (schemaItems: any[], parentPath = '') => {
      if (!Array.isArray(schemaItems)) return;

      schemaItems.forEach((item) => {
        // 跳过非对象项
        if (!item || typeof item !== 'object') return;

        // 处理数组类型的schema
        if (Array.isArray(item)) {
          processSchema(item, parentPath);
          return;
        }

        // 处理字段名
        let fieldName = item.fieldName || '';
        if (parentPath && fieldName && !fieldName.startsWith(parentPath)) {
          fieldName = parentPath ? `${parentPath}.${fieldName}` : fieldName;
        }

        if (fieldName) {
          processField(fieldName);
        }

        // 处理子schema - 两种可能的位置：componentProps.schemas 或 schemas
        let subSchemas = null;
        if (
          item.componentProps?.schemas &&
          Array.isArray(item.componentProps.schemas)
        ) {
          subSchemas = item.componentProps.schemas;
        } else if (item.schemas && Array.isArray(item.schemas)) {
          subSchemas = item.schemas;
        }

        if (Array.isArray(subSchemas)) {
          // 根据flatten属性决定子字段的路径前缀
          const subPath = item.flatten ? '' : fieldName;
          processSchema(subSchemas, subPath);
        }
      });
    };

    // 开始处理整个schema
    processSchema(schema);

    return { responsibleFields };
  }

  /**
   * 分析步骤表单schema，提取直接字段和扁平化字段
   * 只处理顶层字段，因为SubForm组件内部会处理其内部的扁平化
   */
  private analyzeStepFormSchema(schema: any[]): {
    directFields: Set<string>;
    flattenFields: Map<string, boolean>; // 字段名 -> 是否扁平化
  } {
    const directFields = new Set<string>();
    const flattenFields = new Map<string, boolean>();

    schema.forEach((item) => {
      // 跳过非对象项
      if (typeof item !== 'object' || !item) return;

      // 如果是数组，则处理数组中的每个项
      if (Array.isArray(item)) {
        item.forEach((subItem) => {
          if (typeof subItem === 'object' && subItem?.fieldName) {
            // 记录顶层字段
            const rootField = subItem.fieldName.split('.')[0];
            if (rootField) directFields.add(rootField);

            // 如果是扁平化字段，添加到扁平化映射
            if (subItem.flatten === true) {
              flattenFields.set(subItem.fieldName, true);
            }
          }
        });
        return;
      }

      // 处理普通字段项
      if (item.fieldName) {
        // 记录顶层字段 (例如：从 'packageData.resourceLimits' 提取 'packageData')
        const rootField = item.fieldName.split('.')[0];
        if (rootField) directFields.add(rootField);

        // 如果是扁平化字段，添加到扁平化映射
        if (item.flatten === true) {
          flattenFields.set(item.fieldName, true);
        }
      }
    });

    return { directFields, flattenFields };
  }

  /**
   * 深度合并两个对象，确保数组被正确替换而不是追加
   * 可以指定每个字段的合并优先级
   */
  private deepMergeWithPriority(target: any, source: any): any {
    if (!source) return target;
    if (!target) return { ...source };

    const result = { ...target };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceVal = source[key];
        const targetVal = result[key];

        // 判断是否为可合并的对象
        const canMerge =
          isObject(sourceVal) &&
          !Array.isArray(sourceVal) &&
          isObject(targetVal) &&
          !Array.isArray(targetVal);

        // 如果可以合并则递归合并，否则使用source的值
        if (canMerge) {
          result[key] = this.deepMergeWithPriority(targetVal, sourceVal);
        } else if (sourceVal !== undefined) {
          result[key] = sourceVal;
        }
      }
    }

    return result;
  }

  /**
   * 提取步骤表单所需的数据
   * @param values 完整数据对象
   * @param directFields 直接字段集合
   * @param flattenFields 扁平化字段映射
   * @returns 步骤表单所需的数据对象
   */
  private extractStepFormData(
    values: Record<string, any>,
    directFields: Set<string>,
    flattenFields: Map<string, boolean>,
  ): Record<string, any> {
    if (!values) return {};

    const result: Record<string, any> = {};

    // 1. 首先处理直接字段 - 这些是表单需要的顶层字段
    directFields.forEach((field) => {
      if (field in values) {
        result[field] = values[field];
      }
    });

    // 2. 处理扁平化字段 - SubForm中的flatten:true表示其子字段需要放到顶层
    flattenFields.forEach((isFlatten, path) => {
      if (!isFlatten) return;

      // 获取字段路径
      const pathSegments = path.split('.');
      const fieldValue = this.getNestedValue(values, pathSegments);

      // 如果扁平化字段有值且是对象类型，将其属性提升到结果的顶层
      if (
        fieldValue &&
        typeof fieldValue === 'object' &&
        !Array.isArray(fieldValue)
      ) {
        Object.keys(fieldValue).forEach((key) => {
          result[key] = fieldValue[key];
        });
      }
    });

    return result;
  }

  /**
   * 获取嵌套路径的值
   */
  private getNestedValue(obj: Record<string, any>, path: string[]): any {
    if (!obj || path.length === 0) return undefined;

    let current = obj;
    for (const segment of path) {
      if (
        current === undefined ||
        current === null ||
        typeof segment !== 'string'
      )
        return undefined;
      current = current[segment];
    }

    return current;
  }

  /**
   * 根据表单负责的字段有选择性地合并值
   */
  private mergeFieldsByResponsibility(
    target: Record<string, any>,
    source: Record<string, any>,
    responsibleFields: Set<string>,
  ): Record<string, any> {
    if (!source) return target;
    if (!target) return { ...source };

    const result = { ...target };

    // 递归函数处理嵌套对象
    const mergeNestedFields = (
      targetObj: Record<string, any>,
      sourceObj: Record<string, any>,
      currentPath: string = '',
    ): Record<string, any> => {
      const merged = { ...targetObj };

      for (const key in sourceObj) {
        if (!Object.prototype.hasOwnProperty.call(sourceObj, key)) continue;

        const newPath = currentPath ? `${currentPath}.${key}` : key;

        // 如果当前路径是表单负责的字段或其父级，需要进行合并处理
        if (responsibleFields.has(newPath)) {
          const sourceVal = sourceObj[key];
          const mergedVal = merged[key];

          // 判断是否为可合并的对象
          const canMerge =
            isObject(sourceVal) &&
            !Array.isArray(sourceVal) &&
            isObject(mergedVal) &&
            !Array.isArray(mergedVal);

          // 如果可以合并则递归合并，否则使用source的值
          merged[key] = canMerge
            ? mergeNestedFields(mergedVal, sourceVal, newPath)
            : sourceVal;
        }
      }

      return merged;
    };

    return mergeNestedFields(result, source);
  }
}
