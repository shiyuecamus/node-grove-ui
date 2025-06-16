import type { StepFormProps } from './types.js';

import { defineComponent, h, ref, watch } from 'vue';

import { useVbenForm } from '#/adapter/form';

import { StepFormApi } from './step-form-api.js';
import VbenStepForm from './step-form.vue';

/**
 * Hook to create a step form with multiple form steps
 * @param options Configuration options for the step form
 * @returns A tuple containing the step form component and the step form API
 */
export function useStepForm(options: StepFormProps) {
  // Create StepFormApi instance
  const api = new StepFormApi(options);

  // Create form instances for each step
  const formInstances = options.forms.map((formProps) => {
    const [Form, formApi] = useVbenForm(
      Object.assign({}, formProps, {
        showDefaultActions: false,
      }),
    );
    api.addFormApi(formApi);
    return { Form, formApi };
  });

  // Add step change callbacks
  const originalNextStep = api.nextStep;
  api.nextStep = async () => {
    await originalNextStep.call(api);
    if (options.onStepChange) {
      const values = await api.getStepValues();
      options.onStepChange(api.state.current, values);
    }
  };

  const originalPrevStep = api.prevStep;
  api.prevStep = async () => {
    await originalPrevStep.call(api);
    if (options.onStepChange) {
      const values = await api.getStepValues();
      options.onStepChange(api.state.current, values);
    }
  };

  const originalGoToStep = api.goToStep;
  api.goToStep = async (step: number) => {
    await originalGoToStep.call(api, step);
    if (options.onStepChange) {
      const values = await api.getStepValues();
      options.onStepChange(api.state.current, values);
    }
  };

  // Add completion callback
  const originalSubmitAllForms = api.submitAllForms;
  api.submitAllForms = async () => {
    const result = await originalSubmitAllForms.call(api);
    if (result && options.onComplete) {
      options.onComplete(result);
    }
    return result;
  };

  // Create StepForm component
  const StepForm = defineComponent({
    name: 'VbenStepForm',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      // Track current step with ref to enable reactivity
      const current = ref(api.state.current);

      // Sync api.state.current changes to the local ref
      watch(
        () => api.state.current,
        (val) => {
          current.value = val;
        },
      );

      // Sync local ref changes back to api.state.current
      watch(current, (val) => {
        api.state.current = val;
      });

      // Handler for moving to next step
      const handleNextStep = async () => {
        await api.nextStep();
      };

      // Handler for moving to previous step
      const handlePrevStep = async () => {
        await api.prevStep();
      };

      // Handler for submitting all forms
      const handleSubmitAll = async () => {
        await api.submitAllForms();
      };

      return () =>
        h(
          VbenStepForm,
          {
            ...attrs,
            current: current.value,
            formApis: api.state.forms,
            formComponents: formInstances.map((instance) => instance.Form),
            stepConfigs: options.stepConfigs,
            showSteps: options.showSteps !== false,
            actionWrapperClass: options.actionWrapperClass,
            submitButtonOptions: options.submitButtonOptions,
            resetButtonOptions: options.resetButtonOptions,
            stepperClass: options.stepperClass,
            onNextStep: handleNextStep,
            onPrevStep: handlePrevStep,
            onSubmitAll: handleSubmitAll,
            showSubmit: options.showSubmitButton,
          },
          slots,
        );
    },
  });

  return [StepForm, api] as const;
}
