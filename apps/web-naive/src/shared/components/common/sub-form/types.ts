import type { Component } from 'vue';

import type { VbenFormSchema } from '@vben/common-ui';

export interface SubFormProps {
  /**
   * Title of the collapsible panel
   */
  title?: string;

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
  extra?: string;

  /**
   * Component to display as extra content in header
   */
  extraComponent?: Component;

  /**
   * Custom arrow icon
   */
  arrowIcon?: string;

  /**
   * Custom arrow component
   */
  arrowComponent?: Component;

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
}
