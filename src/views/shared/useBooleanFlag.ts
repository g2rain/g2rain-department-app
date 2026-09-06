import { ref } from 'vue';
import { DictItemApi, parseDictCodeAsBoolean } from '../dict/api';

export type BooleanFlagOption = { label: string; value: boolean };

export function useBooleanFlag() {
  const boolOptions = ref<BooleanFlagOption[]>([]);

  const loadBooleanFlagDict = async () => {
    try {
      const items = await DictItemApi.loadByUsageCode('BOOLEAN_FLAG');
      boolOptions.value = [...items]
        .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
        .map(item => {
          const value = parseDictCodeAsBoolean(String(item.code));
          if (value === undefined) return null;
          return {
            label: item.name || String(item.code),
            value,
          };
        })
        .filter((item): item is BooleanFlagOption => item !== null);
    } catch {
      boolOptions.value = [];
    }
  };

  return { boolOptions, loadBooleanFlagDict };
}
