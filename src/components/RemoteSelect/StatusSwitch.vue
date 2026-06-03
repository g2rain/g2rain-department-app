<template>
  <el-switch
    v-model="innerValue"
    :disabled="disabled || loading ? true : undefined"
    :loading="loading"
    :inline-prompt="inlinePrompt"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    :active-text="activeLabel"
    :inactive-text="inactiveLabel"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
/**
 * 状态列开关封装。
 *
 * 权限：在业务页使用 v-permission="'page:status_update'" 绑定在本组件上，
 * 指令会透传到根节点 el-switch（与按钮同一套权限体系；ENABLED 可操作，VISIBLE/无权限置灰）。
 * build:config 扫描 v-permission 静态字符串即可收集。
 */
import { computed, nextTick, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

type StatusValue = string | number | boolean;

interface StatusOption {
  label: string;
  value: StatusValue;
}

interface Props {
  modelValue: StatusValue;
  activeValue?: StatusValue;
  inactiveValue?: StatusValue;
  options?: StatusOption[];
  disabled?: boolean;
  inlinePrompt?: boolean;
  successMessage?: string;
  errorMessage?: string;
  apiMethod: (params: {
    nextValue: StatusValue;
    prevValue: StatusValue;
  }) => Promise<void>;
}

interface Emits {
  (e: 'update:modelValue', value: StatusValue): void;
  (e: 'success', payload: { nextValue: StatusValue; prevValue: StatusValue }): void;
  (e: 'error', payload: { nextValue: StatusValue; prevValue: StatusValue; error: unknown }): void;
}

defineOptions({ inheritAttrs: true });

const props = withDefaults(defineProps<Props>(), {
  activeValue: 'ACTIVE',
  inactiveValue: 'INACTIVE',
  disabled: false,
  inlinePrompt: true,
  successMessage: '更新成功',
  errorMessage: '更新失败',
});

const emit = defineEmits<Emits>();

const innerValue = ref<StatusValue>(props.modelValue);
const loading = ref(false);
const ignoreChange = ref(false);
const isRollingBack = ref(false);

const activeLabel = computed(() => {
  const hit = props.options?.find(i => i.value === props.activeValue);
  return hit?.label || (props.activeValue === 'ACTIVE' ? '有效' : String(props.activeValue));
});

const inactiveLabel = computed(() => {
  const hit = props.options?.find(i => i.value === props.inactiveValue);
  return hit?.label || (props.inactiveValue === 'INACTIVE' ? '无效' : String(props.inactiveValue));
});

watch(
  () => props.modelValue,
  async (val) => {
    ignoreChange.value = true;
    innerValue.value = val;
    await nextTick();
    ignoreChange.value = false;
  }
);

const handleChange = async (val: StatusValue) => {
  if (ignoreChange.value || isRollingBack.value) return;

  const nextValue = val;
  const prevValue = props.modelValue;

  if (nextValue === prevValue) return;

  emit('update:modelValue', nextValue);

  loading.value = true;

  try {
    await props.apiMethod({ nextValue, prevValue });

    if (props.successMessage) {
      ElMessage.success(props.successMessage);
    }

    emit('success', { nextValue, prevValue });
  } catch (error) {
    isRollingBack.value = true;

    innerValue.value = prevValue;
    emit('update:modelValue', prevValue);

    if (props.errorMessage) {
      ElMessage.error(props.errorMessage);
    }

    emit('error', { nextValue, prevValue, error });
  } finally {
    loading.value = false;
    isRollingBack.value = false;
  }
};
</script>