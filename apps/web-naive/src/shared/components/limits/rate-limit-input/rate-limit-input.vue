<script lang="ts" setup>
import type { OnUpdateValue } from 'naive-ui/es/dynamic-input/src/interface';

import type { RateLimit, RateLimitInputProps } from './types';

import { NDynamicInput, NInputNumber } from 'naive-ui';

const props = withDefaults(defineProps<RateLimitInputProps>(), {
  value: () => [],
  defaultValue: () => ({ limit: 10, windowSeconds: 60 }),
  disabled: false,
  addable: true,
  removable: true,
});

const modelValue = defineModel<RateLimit[]>({
  default: () => [],
});

// Create a new rate limit entry
const onCreate = () => {
  return { ...props.defaultValue };
};

// Watch for changes when items are added/removed/changed
const onUpdateValue: OnUpdateValue = (value) => {
  modelValue.value = value as RateLimit[];
};
</script>

<template>
  <NDynamicInput
    v-model:value="modelValue"
    :disabled="disabled"
    :on-create="onCreate"
    :on-update:value="onUpdateValue"
    :create-button-props="{ disabled }"
    :max="maxItems"
  >
    <template #create-button-default>
      {{ $t('common.rateLimit.createRateLimit') }}
    </template>
    <template #default="{ value }">
      <NInputNumber
        class="mr-2 w-2/5"
        v-model:value="value.limit"
        :disabled="disabled"
        :min="1"
        :placeholder="$t('common.rateLimit.limitPlaceholder')"
      />
      <div
        class="ml-2 mr-2 flex w-[80px] items-center justify-center text-[12px]"
      >
        {{ $t('common.rateLimit.limitHint') }}
      </div>
      <NInputNumber
        class="mr-2 w-2/5"
        v-model:value="value.windowSeconds"
        :disabled="disabled"
        :min="1"
        :placeholder="$t('common.rateLimit.windowSecondsPlaceholder')"
      />
      <div class="ml-2 mr-2 flex items-center justify-center text-[12px]">
        {{ $t('common.rateLimit.windowSecondsHint') }}
      </div>
    </template>
  </NDynamicInput>
</template>

<style scoped>
.n-dynamic-input-add-button {
  width: auto !important;
}
</style>
