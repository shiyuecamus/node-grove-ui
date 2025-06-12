import type { Component } from 'vue';

import type { FormCommonConfig, VbenFormSchema } from '@vben/common-ui';

export interface SubFormProps {
  /**
   * Title of the collapsible panel
   */
  title?: Component | string;

  /**
   * Unique identifier for the panel
   */
  name?: string;

  /**
   * Whether the panel is expanded by default
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Extra content to display in the header
   */
  extra?: Component | string;

  /**
   * Custom arrow icon
   */
  arrowIcon?: Component | string;

  /**
   * Form schemas for this sub-form
   */
  schemas: VbenFormSchema[];

  /**
   * CSS class for the form wrapper
   * @default "grid-cols-1"
   */
  wrapperClass?: string;

  /**
   * Form layout
   * @default "horizontal"
   */
  layout?: 'horizontal' | 'vertical';

  /**
   * Whether to disable the form
   * @default false
   */
  disabled?: boolean;

  /**
   * Common config for the form
   */
  commonConfig?: FormCommonConfig;

  /**
   * Arrow placement
   * @default "right"
   */
  arrowPlacement?: 'left' | 'right';

  /**
   * Header class
   */
  headerClass?: string;

  /**
   * Header extra class
   */
  headerExtraClass?: string;

  /**
   * Header content class
   */
  headerContentClass?: string;
}

/**
 * Options for creating a form section
 */
export interface CreateFormSectionOptions {
  /**
   * Title for the section
   */
  title: Component | string;

  /**
   * Icon for the section title
   */
  icon: string;

  /**
   * Field name for the form section
   */
  fieldName: string;

  /**
   * Form schemas for this section
   */
  schemas: VbenFormSchema[];

  /**
   * Whether this section is expanded by default
   * @default true
   */
  defaultExpanded?: boolean;

  /**
   * Advanced schemas for this section
   * @default []
   */
  advancedSchemas?: VbenFormSchema[];

  /**
   * Extra content to display in the header
   */
  extra?: Component | string;

  /**
   * Form validation rules
   */
  rules?: any;
}
