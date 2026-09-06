
<template>
  <div class="data_permission_other-page" :class="{ 'data_permission_other-page--embedded': embedded }">
    <el-card class="data_permission_other-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item v-if="!embedded" :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_ORGAN', '所属机构')">
          <OrganSelect
            v-model="queryForm.organId"
            :api-method="OrganApi.searchOrgans"
            :placeholder="$t('DE_DATA_PERMISSION_OTHER_PH_ORGAN', '请选择所属机构')"
            width="200px"
          />
        </el-form-item>
        <el-form-item v-if="!embedded" :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_GROUP', '权限小组')">
          <el-input v-model="queryForm.groupId" :placeholder="$t('DE_DATA_PERMISSION_OTHER_PH_GROUP_ID', '请输入权限小组ID')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_META', '权限策略')">
          <ApiSelect
            :key="`query-meta-${effectiveOrganId ?? 'none'}`"
            v-model="queryForm.metaId"
            :api-method="metaSelectMethod"
            label-key="name"
            :placeholder="$t('DE_DATA_PERMISSION_OTHER_PH_META', '请选择权限策略')"
            allow-empty-keyword
            prefetch-on-open
            :disabled="!embedded && effectiveOrganId == null"
            width="220px"
          />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_STATUS', '状态')">
          <DictSelect v-model="queryForm.status" usage-code="COMMON_STATUS" :api-method="DictItemApi.select" :placeholder="$t('DE_DATA_PERMISSION_OTHER_PH_STATUS', '请选择状态')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
          <el-button @click="handleReset">{{ $t('G2_BTN_RESET', '重置') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="data_permission_other-page__header">
      <div class="data_permission_other-page__title-group">
        <h2>{{ $t('DE_DATA_PERMISSION_OTHER_TITLE', '管理规则配置') }}</h2>
      </div>
      <el-button type="primary" v-permission="'data_permission_other:add'" @click="handleCreate">{{ $t('DE_DATA_PERMISSION_OTHER_BTN_ADD', '新增规则配置') }}</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" :label="$t('G2_FIELD_ID', 'ID')" width="120" />
      <el-table-column :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_META', '权限策略')" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">{{ resolveMetaName(row.metaId) }}</template>
      </el-table-column>
      <el-table-column :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_READ', '可读')" width="80" align="center">
        <template #default="{ row }">
          <DictText :value="row.read" usage-code="BOOLEAN_FLAG" :api-method="DictItemApi.select" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_WRITE', '可写')" width="80" align="center">
        <template #default="{ row }">
          <DictText :value="row.write" usage-code="BOOLEAN_FLAG" :api-method="DictItemApi.select" />
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('G2_FIELD_STATUS', '状态')" width="180">
        <template #default="{ row }">
          <StatusSwitch
            v-model="row.status"
            v-permission="'data_permission_other:status_update'"
            active-value="ACTIVE"
            inactive-value="INACTIVE"
            usage-code="COMMON_STATUS"
            :api-method="({ nextValue }) => DataPermissionOtherApi.updateStatus(row.id, String(nextValue))"
            @success="loadData"
          />
        </template>
      </el-table-column>
      <TableColumn prop="createTime" :label="$t('G2_FIELD_CREATE_TIME', '创建时间')" width="180" :sortable="true" />
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" :sortable="true" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="160">
        <template #default="{ row }">
          <el-button type="primary" v-permission="'data_permission_other:edit'" link size="small" @click="handleEdit(row)">{{ $t('G2_BTN_EDIT', '编辑') }}</el-button>
          <el-button type="danger" v-permission="'data_permission_other:delete'" link size="small" @click="handleDelete(row)">{{ $t('G2_BTN_DELETE', '删除') }}</el-button>
        </template>
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>{{ $t('G2_FIELD_ACTION', '操作') }}</span>
            <SortManagerButton />
          </div>
        </template>
      </el-table-column>
    </SortableTable>

    <div class="data_permission_other-page__pagination">
      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <el-dialog v-model="editDialogVisible" :title="isEdit ? $t('DE_DATA_PERMISSION_OTHER_DLG_EDIT', '编辑规则配置') : $t('DE_DATA_PERMISSION_OTHER_DLG_ADD', '新增规则配置')" width="680px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item v-if="!embedded" :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_ORGAN', '所属机构')" prop="organId">
          <OrganSelect
            v-model="editForm.organId"
            :api-method="OrganApi.searchOrgans"
            :placeholder="$t('DE_DATA_PERMISSION_OTHER_PH_ORGAN', '请选择所属机构')"
            width="100%"
          />
        </el-form-item>
        <el-form-item v-if="!embedded" :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_GROUP', '权限小组')" prop="groupId">
          <el-input v-model="editForm.groupId" :placeholder="$t('DE_DATA_PERMISSION_OTHER_PH_GROUP_ID', '请输入权限小组ID')" />
        </el-form-item>
        <el-form-item :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_META', '权限策略')" prop="metaId">
          <ApiSelect
            :key="`edit-meta-${editOrganId ?? 'none'}`"
            v-model="editForm.metaId"
            :api-method="editMetaSelectMethod"
            label-key="name"
            :placeholder="$t('DE_DATA_PERMISSION_OTHER_PH_META', '请选择权限策略')"
            allow-empty-keyword
            prefetch-on-open
            :disabled="!embedded && editOrganId == null"
            width="100%"
            @change="handleEditMetaChange"
          />
        </el-form-item>
        <el-form-item :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_READ', '可读')">
          <el-radio-group v-model="editForm.read">
            <el-radio v-for="option in boolOptions" :key="`read-${String(option.value)}`" :value="option.value">
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_WRITE', '可写')">
          <el-radio-group v-model="editForm.write">
            <el-radio v-for="option in boolOptions" :key="`write-${String(option.value)}`" :value="option.value">
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('DE_DATA_PERMISSION_OTHER_FIELD_RULE', '权限规则')" prop="permissionRule">
          <div class="permission-rule-builder">
            <div
              v-for="(row, index) in ruleRows"
              :key="row.key"
              class="permission-rule-builder__row"
            >
              <el-select
                v-model="row.fieldName"
                :placeholder="$t('DE_DATA_PERMISSION_OTHER_PH_FIELD', '选择字段')"
                :disabled="!editForm.metaId || metaFields.length === 0"
                class="permission-rule-builder__field"
                style="width: 140px"
              >
                <el-option
                  v-for="field in availableFieldsForRow(index)"
                  :key="field.fieldName"
                  :label="formatFieldLabel(field)"
                  :value="field.fieldName"
                />
              </el-select>
              <el-input
                v-model="row.valuesText"
                :placeholder="$t('DE_DATA_PERMISSION_OTHER_PH_VALUES', '多个值用逗号分隔，如 1,2,3 或 a,b,c')"
                class="permission-rule-builder__values"
              />
              <el-button
                v-if="ruleRows.length > 1"
                type="danger"
                link
                @click="removeRuleRow(index)"
              >
                {{ $t('G2_BTN_DELETE', '删除') }}
              </el-button>
            </div>
            <el-button
              v-if="canAddRuleRow"
              type="primary"
              link
              :disabled="!editForm.metaId"
              @click="addRuleRow"
            >
              {{ $t('DE_DATA_PERMISSION_OTHER_BTN_ADD_CONDITION', '添加条件') }}
            </el-button>
            <div v-if="editForm.metaId && metaFields.length === 0" class="permission-rule-builder__hint">
              {{ $t('DE_DATA_PERMISSION_OTHER_HINT_NO_FIELDS', '当前权限策略暂无可选字段') }}
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">{{ $t('G2_BTN_CANCEL', '取消') }}</el-button>
          <el-button type="primary" @click="submitEdit">{{ $t('G2_BTN_SAVE', '保存') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { t } from '@platform/i18n';
import { DataPermissionOtherApi } from './api';
import { DataPermissionMetaApi } from '../data_permission_meta/api';
import { DataPermissionFieldApi } from '../data_permission_field/api';
import type { DataPermissionField } from '../data_permission_field/type';
import { OrganApi } from '../organ/api';
import { DictItemApi } from '../dict/api';
import { useBooleanFlag } from '../shared/useBooleanFlag';
import type { DataPermissionOther, DataPermissionOtherPayload, DataPermissionOtherQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { SortableTable, TableColumn, SortManagerButton, OrganSelect, ApiSelect, DictSelect, DictText, StatusSwitch, showErrorMessage } from '@/components';
import { buildPermissionRule, parsePermissionRule, validatePermissionRuleRows, type PermissionRuleRow } from './permissionRule.util';
import { storeToRefs } from 'pinia';
import { useLocaleStore } from '@platform/stores/locale.store';

const { boolOptions, loadBooleanFlagDict } = useBooleanFlag();

const props = defineProps<{ groupId?: number; organId?: number }>();

const embedded = computed(() => props.groupId != null);

const RULE_VALIDATION_I18N: Record<string, [string, string]> = {
  '请至少配置一条权限规则': ['DE_DATA_PERMISSION_OTHER_ERR_RULE_MIN', '请至少配置一条权限规则'],
  '请选择权限字段': ['DE_DATA_PERMISSION_OTHER_ERR_FIELD', '请选择权限字段'],
  '请输入字段值': ['DE_DATA_PERMISSION_OTHER_ERR_VALUES', '请输入字段值'],
  '请输入有效的字段值': ['DE_DATA_PERMISSION_OTHER_ERR_VALUES_INVALID', '请输入有效的字段值'],
  '权限字段不能重复': ['DE_DATA_PERMISSION_OTHER_ERR_FIELD_DUP', '权限字段不能重复'],
};

const translateRuleError = (msg: string | null): string | null => {
  if (!msg) return null;
  const entry = RULE_VALIDATION_I18N[msg];
  return entry ? t(entry[0], entry[1]) : msg;
};

const metaOptions = ref<Array<{ value: number; label: string; modelId: number }>>([]);
const metaFields = ref<DataPermissionField[]>([]);

type RuleRowForm = PermissionRuleRow & { key: number };
let ruleRowKey = 0;
const createEmptyRuleRow = (): RuleRowForm => ({
  fieldName: '',
  valuesText: '',
  key: ++ruleRowKey,
});
const ruleRows = ref<RuleRowForm[]>([createEmptyRuleRow()]);

const effectiveOrganId = computed(() => props.organId ?? queryForm.organId);

const editOrganId = computed(() => props.organId ?? editForm.organId);

const metaSelectMethod = (params: { key?: string; value?: number }) =>
  DataPermissionMetaApi.searchForSelect(params, effectiveOrganId.value);

const editMetaSelectMethod = (params: { key?: string; value?: number }) =>
  DataPermissionMetaApi.searchForSelect(params, editOrganId.value);

const loadMetaOptions = async (organId?: number) => {
  if (organId == null) {
    metaOptions.value = [];
    return;
  }
  try {
    const metas = await DataPermissionMetaApi.list({ organId });
    metaOptions.value = metas.map(meta => ({
      value: meta.id,
      label: DataPermissionMetaApi.formatMetaLabel(meta),
      modelId: meta.modelId,
    }));
  } catch {
    metaOptions.value = [];
  }
};

const resolveMetaName = (metaId?: number) =>
  metaOptions.value.find(item => item.value === metaId)?.label ?? (metaId != null ? String(metaId) : '');

const formatFieldLabel = (field: DataPermissionField) =>
  field.fieldTitle ? `${field.fieldTitle} (${field.fieldName})` : field.fieldName;

const resolveMetaModelId = async (metaId: number): Promise<number | undefined> => {
  const cached = metaOptions.value.find(item => item.value === metaId);
  if (cached) {
    return cached.modelId;
  }

  const organId = editOrganId.value ?? effectiveOrganId.value;
  const metas = await DataPermissionMetaApi.list(organId != null ? { id: metaId, organId } : { id: metaId });
  return metas[0]?.modelId;
};

const loadMetaFields = async (metaId?: number) => {
  if (metaId == null) {
    metaFields.value = [];
    return;
  }
  try {
    const modelId = await resolveMetaModelId(metaId);
    if (modelId == null) {
      metaFields.value = [];
      return;
    }
    const fields = await DataPermissionFieldApi.list({ modelId });
    metaFields.value = fields.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    metaFields.value = [];
  }
};

const availableFieldsForRow = (rowIndex: number) => {
  const selectedFields = new Set(
    ruleRows.value
      .filter((_, index) => index !== rowIndex)
      .map(row => row.fieldName)
      .filter(Boolean),
  );
  return metaFields.value.filter(
    field => !selectedFields.has(field.fieldName) || ruleRows.value[rowIndex].fieldName === field.fieldName,
  );
};

const canAddRuleRow = computed(() => {
  if (metaFields.value.length === 0) {
    return false;
  }
  return ruleRows.value.length < metaFields.value.length;
});

const resetRuleRows = () => {
  ruleRows.value = [createEmptyRuleRow()];
};

const addRuleRow = () => {
  if (!canAddRuleRow.value) {
    return;
  }
  ruleRows.value.push(createEmptyRuleRow());
};

const removeRuleRow = (index: number) => {
  ruleRows.value.splice(index, 1);
  if (ruleRows.value.length === 0) {
    resetRuleRows();
  }
};

const applyPermissionRuleToForm = (permissionRule: string) => {
  const parsedRows = parsePermissionRule(permissionRule);
  ruleRows.value = parsedRows.length > 0
    ? parsedRows.map(row => ({ ...row, key: ++ruleRowKey }))
    : [createEmptyRuleRow()];
};

const handleEditMetaChange = () => {
  editForm.permissionRule = '';
  resetRuleRows();
};

const queryForm = reactive({
  organId: undefined as number | undefined,
  metaId: undefined as number | undefined,
  groupId: props.groupId as number | undefined,
  status: '',
  sorts: undefined as string[] | undefined,
});

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<DataPermissionOther[]>([]);

const loadData = async () => {
  try {
    const query = Object.fromEntries(
      Object.entries({
        ...queryForm,
        groupId: props.groupId ?? queryForm.groupId,
      }).filter(([_, v]) => (v ?? '') !== '' && [v].flat().length),
    ) as DataPermissionOtherQuery;

    const pageData = await DataPermissionOtherApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DataPermissionOtherQuery);

    tableData.value = pageData.records;
    pagination.total = pageData.total;
    await loadMetaOptions(effectiveOrganId.value);
  } catch (error: any) {
    showErrorMessage(error || t('G2_MSG_LOAD_FAIL', '加载列表失败'));
  }
};

const handleSortChange = (params: Record<string, string>) => {
  const sorts = Object.entries(params)
    .filter(([k, v]) => k && v)
    .map(([k, v]) => `${k},${v.toLowerCase() === 'desc' ? 'desc' : 'asc'}`);
  queryForm.sorts = sorts.length ? sorts : undefined;
  loadData();
};

const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};

const handleReset = () => {
  queryForm.organId = props.organId;
  queryForm.metaId = undefined;
  queryForm.groupId = props.groupId;
  queryForm.status = '';
  queryForm.sorts = undefined;
  pagination.pageNum = 1;
  loadData();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  loadData();
};

const handlePageChange = (page: number) => {
  pagination.pageNum = page;
  loadData();
};

const handleDelete = (row: DataPermissionOther) => {
  ElMessageBox.confirm(
    t('DE_DATA_PERMISSION_OTHER_DEL_CONFIRM', `确认删除规则配置「${row.id}」吗？`),
    t('G2_LBL_TIP', '提示'),
    { type: 'warning' },
  )
    .then(async () => {
      try {
        await DataPermissionOtherApi.remove(row.id);
        if (tableData.value.length === 1 && pagination.pageNum > 1) {
          pagination.pageNum--;
        }
        await loadData();
        ElMessage.success(t('G2_MSG_DELETE_OK', '删除成功'));
      } catch (error: any) {
        showErrorMessage(error || t('G2_MSG_DELETE_FAIL', '删除失败'));
      }
    })
    .catch(() => {});
};

const editDialogVisible = ref(false);
const isEdit = ref(false);
const editFormRef = ref<FormInstance | null>(null);

const editForm = reactive({
  id: undefined as number | undefined,
  organId: undefined as number | undefined,
  groupId: undefined as number | undefined,
  metaId: undefined as number | undefined,
  read: true,
  write: false,
  permissionRule: '',
});

const editRules = computed<FormRules>(() => ({
  ...(!embedded.value
    ? { organId: [{ required: true, message: t('DE_DATA_PERMISSION_OTHER_VLD_ORGAN', '请选择所属机构'), trigger: 'change' }] }
    : {}),
  metaId: [{ required: true, message: t('DE_DATA_PERMISSION_OTHER_VLD_META', '请选择权限策略'), trigger: 'change' }],
  ...(embedded.value
    ? {}
    : { groupId: [{ required: true, message: t('DE_DATA_PERMISSION_OTHER_VLD_GROUP_ID', '请输入权限小组ID'), trigger: 'blur' }] }),
  permissionRule: [{ required: true, message: t('DE_DATA_PERMISSION_OTHER_VLD_RULE', '请配置权限规则'), trigger: 'change' }],
}));

const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  editForm.id = undefined;
  editForm.organId = props.organId ?? queryForm.organId;
  editForm.groupId = props.groupId;
  editForm.metaId = undefined;
  editForm.read = true;
  editForm.write = false;
  editForm.permissionRule = '';
  metaFields.value = [];
  resetRuleRows();
  editDialogVisible.value = true;
};

const handleEdit = async (row: DataPermissionOther) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  editForm.id = row.id;
  editForm.organId = props.organId ?? queryForm.organId;
  editForm.groupId = row.groupId;
  editForm.metaId = row.metaId;
  editForm.read = row.read;
  editForm.write = row.write;
  editForm.permissionRule = row.permissionRule;
  await loadMetaFields(row.metaId);
  applyPermissionRuleToForm(row.permissionRule);
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editForm.metaId) {
    ElMessage.warning(t('DE_DATA_PERMISSION_OTHER_WARN_META', '请选择权限策略'));
    return;
  }
  if (metaFields.value.length === 0) {
    ElMessage.warning(t('DE_DATA_PERMISSION_OTHER_WARN_NO_FIELDS', '当前权限策略无可选字段'));
    return;
  }

  const ruleError = translateRuleError(validatePermissionRuleRows(ruleRows.value));
  if (ruleError) {
    ElMessage.warning(ruleError);
    return;
  }

  editForm.permissionRule = buildPermissionRule(ruleRows.value);

  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: DataPermissionOtherPayload = {
    metaId: editForm.metaId,
    groupId: props.groupId ?? editForm.groupId,
    read: editForm.read,
    write: editForm.write,
    permissionRule: editForm.permissionRule,
  };

  try {
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DataPermissionOtherApi.save(payload);
    ElMessage.success(isEdit.value ? t('G2_MSG_UPDATE_OK', '更新成功') : t('G2_MSG_ADD_OK', '新增成功'));
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || t('G2_MSG_SAVE_FAIL', '保存失败'));
  }
};

watch(
  () => [props.groupId, props.organId] as const,
  () => {
    queryForm.groupId = props.groupId;
    queryForm.organId = props.organId;
    pagination.pageNum = 1;
    loadData();
  },
  { immediate: true },
);

watch(
  () => queryForm.organId,
  (organId, prevOrganId) => {
    if (organId !== prevOrganId) {
      queryForm.metaId = undefined;
    }
    loadMetaOptions(organId);
  },
);

watch(
  () => editForm.metaId,
  metaId => {
    loadMetaFields(metaId);
  },
);

watch(
  () => editForm.organId,
  (organId, prevOrganId) => {
    if (organId !== prevOrganId && !isEdit.value) {
      editForm.metaId = undefined;
    }
  },
);

onMounted(() => {
  void loadBooleanFlagDict();
});

const { locale: userLocale } = storeToRefs(useLocaleStore());
watch(userLocale, () => {
  void loadBooleanFlagDict();
});
</script>

<style scoped>
.data_permission_other-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.data_permission_other-page--embedded {
  padding: 0;
  background-color: transparent;
  min-height: auto;
  height: auto;
}

.data_permission_other-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.data_permission_other-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.data_permission_other-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.data_permission_other-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.data_permission_other-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.permission-rule-builder {
  width: 100%;
}

.permission-rule-builder__row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  min-width: 0;
}

.permission-rule-builder__field {
  flex: 0 0 140px;
  width: 140px;
}

.permission-rule-builder__field :deep(.el-select__wrapper) {
  width: 100%;
}

.permission-rule-builder__field :deep(.el-select__selected-item) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.permission-rule-builder__values {
  flex: 1;
  min-width: 0;
}

.permission-rule-builder__hint {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
}
</style>
