import type { Component } from 'vue';

import RateLimitInput from './rate-limit-input.vue';

export { RateLimitInput };

// Register as a form component
export default {
  name: 'RateLimitInput',
  component: RateLimitInput as Component,
};

export { type RateLimit, type RateLimitInputProps } from './types';
