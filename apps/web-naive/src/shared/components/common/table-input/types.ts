import type { VbenFormSchema } from '@vben/common-ui';

import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

/**
 * Props for TableInput component
 */
export interface TableInputProps<T> {
  /**
   * Grid options for vxe-table
   */
  gridOptions?: Partial<VxeGridProps<T>>;

  /**
   * Grid events for vxe-table
   */
  gridEvents?: VxeGridListeners<T>;

  /**
   * Form schemas for the modal
   */
  formSchemas: VbenFormSchema[];

  /**
   * Whether to disable the input
   */
  disabled?: boolean;

  /**
   * Maximum number of rows
   */
  maxItems?: number;

  /**
   * Modal title for adding new item
   */
  addModalTitle?: string;

  /**
   * Modal title for editing item
   */
  editModalTitle?: string;

  /**
   * Add button text
   */
  addButtonText?: string;

  /**
   * Modal class
   */
  modalClass?: string;

  /**
   * Grid height
   */
  height?: number | string;
}

/**
 * Props for TableFormInput component
 */
export interface TableFormInputProps {
  /**
   * Modal title for adding new item
   */
  addModalTitle?: string;

  /**
   * Modal title for editing item
   */
  editModalTitle?: string;

  /**
   * Form schemas for the modal
   */
  formSchemas: VbenFormSchema[];

  /**
   * Whether the modal is open
   */
  isOpen?: boolean;

  /**
   * Modal class
   */
  modalClass?: string;
}
