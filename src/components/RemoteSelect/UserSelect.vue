<template>
  <RemoteSelect
    v-model="innerValue"
    :fetch-data="fetchData"
    :value-key="valueKey"
    :label-key="labelKey"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="resolvedDisabled"
    :width="width"
    :debounce-delay="debounceDelay"
    @change="handleChange"
    @clear="$emit('clear')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RemoteSelect } from './index';
import { UserApi } from '@/views/user/api';
import type { FetchDataFunction, RemoteSelectOption } from './types';

interface Props {
  modelValue?: number | null;
  organId?: number | null;
  valueKey?: string;
  labelKey?: string;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  width?: string;
  debounceDelay?: number;
}

interface Emits {
  (e: 'update:modelValue', value: number | null | undefined): void;
  (e: 'change', value: number | null | undefined): void;
  (e: 'clear'): void;
}

const props = withDefaults(defineProps<Props>(), {
  valueKey: 'userId',
  labelKey: 'userName',
  placeholder: '请输入姓名搜索',
  clearable: true,
  disabled: false,
  width: '200px',
  debounceDelay: 300,
});

const emit = defineEmits<Emits>();

const resolvedDisabled = computed(() => props.disabled || props.organId == null);

const innerValue = computed({
  get: () => props.modelValue,
  set: (value: number | null | undefined) => {
    emit('update:modelValue', value);
  },
});

const handleChange = (value: number | string | null | undefined) => {
  const numValue = typeof value === 'string' ? Number(value) : value;
  emit('change', numValue as number | null | undefined);
};

const fetchData: FetchDataFunction<RemoteSelectOption> = async (params) => {
  if (props.organId == null) {
    return [];
  }
  try {
    return await UserApi.searchForSelect(params, props.organId);
  } catch (error) {
    console.error('UserSelect fetchData error:', error);
    return [];
  }
};
</script>
