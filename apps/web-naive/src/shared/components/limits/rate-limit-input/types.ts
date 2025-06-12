import type { FormItemRule } from 'naive-ui';

export interface RateLimit {
  limit: number;
  windowSeconds: number;
}

export interface RateLimitInputProps {
  /**
   * The value of the rate limit input
   */
  value?: RateLimit[];

  /**
   * Default value when creating a new rate limit entry
   */
  defaultValue?: RateLimit;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Custom validation rules
   */
  rules?: FormItemRule[];

  /**
   * Whether to allow adding new rate limits
   * @default true
   */
  addable?: boolean;

  /**
   * Whether to allow removing rate limits
   * @default true
   */
  removable?: boolean;

  /**
   * Maximum number of rate limits
   * @default 10
   */
  maxItems?: number;
}
