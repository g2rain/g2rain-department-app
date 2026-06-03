import { ref } from 'vue';
import { DictItemApi } from '../dict/api';

export type StatusOption = { label: string; value: string };

export function useCommonStatus() {
  const statusOptions = ref<StatusOption[]>([]);

  const loadCommonStatusDict = async () => {
    try {
      const items = await DictItemApi.loadByUsageCode('COMMON_STATUS');
      statusOptions.value = [...items]
        .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
        .map(item => ({
          label: item.name || String(item.code),
          value: String(item.code),
        }));
    } catch {
      statusOptions.value = [];
    }
  };

  return { statusOptions, loadCommonStatusDict };
}
