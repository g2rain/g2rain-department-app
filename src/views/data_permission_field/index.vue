<template>
  <div class="data_permission_field-page">
    <el-card class="data_permission_field-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item :label="$t('DE_DATA_PERMISSION_FIELD_FIELD_NAME', '条件字段')">
          <el-input v-model="queryForm.fieldName" :placeholder="$t('DE_DATA_PERMISSION_FIELD_PH_FIELD_NAME', '请输入条件字段')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('DE_DATA_PERMISSION_FIELD_FIELD_TITLE', '条件名称')">
          <el-input v-model="queryForm.fieldTitle" :placeholder="$t('DE_DATA_PERMISSION_FIELD_PH_FIELD_TITLE', '请输入条件名称')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
          <el-button @click="handleReset">{{ $t('G2_BTN_RESET', '重置') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="data_permission_field-page__header">
      <div class="data_permission_field-page__title-group">
        <h2>{{ $t('DE_DATA_PERMISSION_FIELD_TITLE', '管理条件字段') }}</h2>
      </div>
      <el-button type="primary" v-permission="'data_permission_field:add'" @click="handleCreate">{{ $t('DE_DATA_PERMISSION_FIELD_BTN_ADD', '新增条件字段') }}</el-button>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" :label="$t('G2_FIELD_ID', 'ID')" width="120" />
      <el-table-column prop="fieldName" :label="$t('DE_DATA_PERMISSION_FIELD_FIELD_NAME', '条件字段')" width="180" />
      <el-table-column prop="fieldTitle" :label="$t('DE_DATA_PERMISSION_FIELD_FIELD_TITLE', '条件名称')" width="180" />
      <el-table-column prop="sortOrder" :label="$t('G2_LBL_SORT', '排序')" width="100" />
      <el-table-column prop="createTime" :label="$t('G2_FIELD_CREATE_TIME', '创建时间')" width="180" />
      <el-table-column prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="200">
        <template #default="{ row }">
          <el-button type="primary" link size="small" v-permission="'data_permission_field:edit'" @click="handleEdit(row)">{{ $t('G2_BTN_EDIT', '编辑') }}</el-button>
          <el-button type="danger" link size="small" v-permission="'data_permission_field:delete'" @click="handleDelete(row)">{{ $t('G2_BTN_DELETE', '删除') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="data_permission_field-page__pagination">
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

    <el-dialog v-model="editDialogVisible" :title="editDialogTitle" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item :label="$t('DE_DATA_PERMISSION_FIELD_FIELD_NAME', '条件字段')" prop="fieldName">
          <el-input v-model="editForm.fieldName" :placeholder="$t('DE_DATA_PERMISSION_FIELD_PH_FIELD_NAME', '请输入条件字段')" />
        </el-form-item>
        <el-form-item :label="$t('DE_DATA_PERMISSION_FIELD_FIELD_TITLE', '条件名称')" prop="fieldTitle">
          <el-input v-model="editForm.fieldTitle" :placeholder="$t('DE_DATA_PERMISSION_FIELD_PH_FIELD_TITLE', '请输入条件名称')" />
        </el-form-item>
        <el-form-item :label="$t('G2_LBL_SORT', '排序')" prop="sortOrder">
          <el-input-number v-model="editForm.sortOrder" :min="0" :step="1" />
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
import { ref, reactive, computed, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { t } from '@platform/i18n';
import { DataPermissionFieldApi } from './api';
import type { DataPermissionField, DataPermissionFieldPayload, DataPermissionFieldQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { showErrorMessage } from '@/components';

const props = defineProps<{ modelId?: number }>();

const queryForm = reactive({
  modelId: props.modelId,
  fieldName: '',
  fieldTitle: '',
});

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<DataPermissionField[]>([]);

const loadData = async () => {
  try {
    const query = Object.fromEntries(
      Object.entries({ ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as DataPermissionFieldQuery;

    const pageData = await DataPermissionFieldApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DataPermissionFieldQuery);

    tableData.value = pageData.records;
    pagination.total = pageData.total;
  } catch (error: any) {
    showErrorMessage(error || t('G2_MSG_LOAD_FAIL', '加载列表失败'));
  }
};

const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};

const handleReset = () => {
  queryForm.modelId = props.modelId;
  queryForm.fieldName = '';
  queryForm.fieldTitle = '';
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

const handleDelete = (row: DataPermissionField) => {
  ElMessageBox.confirm(
    t('DE_DATA_PERMISSION_FIELD_DEL_CONFIRM', `确认删除条件字段「${row.id}」吗？`),
    t('G2_LBL_TIP', '提示'),
    { type: 'warning' },
  )
    .then(async () => {
      try {
        await DataPermissionFieldApi.remove(row.id);
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
  modelId: props.modelId as number | undefined,
  fieldName: '',
  fieldTitle: '',
  sortOrder: 0,
});

const editDialogTitle = computed(() =>
  isEdit.value
    ? t('DE_DATA_PERMISSION_FIELD_DLG_EDIT', '编辑条件字段')
    : t('DE_DATA_PERMISSION_FIELD_DLG_ADD', '新增条件字段'),
);

const editRules = computed<FormRules>(() => ({
  fieldName: [{ required: true, message: t('DE_DATA_PERMISSION_FIELD_PH_FIELD_NAME', '请输入条件字段'), trigger: 'blur' }],
  fieldTitle: [{ required: true, message: t('DE_DATA_PERMISSION_FIELD_PH_FIELD_TITLE', '请输入条件名称'), trigger: 'blur' }],
  sortOrder: [{ required: true, message: t('DE_DATA_PERMISSION_FIELD_PH_SORT_ORDER', '请输入排序'), trigger: 'blur' }],
}));

const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  editForm.modelId = props.modelId;
  editForm.fieldName = '';
  editForm.fieldTitle = '';
  editForm.sortOrder = 0;
  editDialogVisible.value = true;
};

const handleEdit = (row: DataPermissionField) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  editForm.id = row.id;
  editForm.modelId = row.modelId;
  editForm.fieldName = row.fieldName;
  editForm.fieldTitle = row.fieldTitle;
  editForm.sortOrder = row.sortOrder;
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  if (!editForm.modelId) {
    ElMessage.error(t('DE_DATA_PERMISSION_FIELD_ERR_MODEL_REQUIRED', '请设置权限模型'));
    return;
  }

  const payload: DataPermissionFieldPayload = {
    modelId: editForm.modelId,
    fieldName: editForm.fieldName,
    fieldTitle: editForm.fieldTitle,
    sortOrder: editForm.sortOrder,
  };

  try {
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DataPermissionFieldApi.save(payload);
    ElMessage.success(isEdit.value ? t('G2_MSG_UPDATE_OK', '更新成功') : t('G2_MSG_ADD_OK', '新增成功'));
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || t('G2_MSG_SAVE_FAIL', '保存失败'));
  }
};

watch(
  () => props.modelId,
  () => handleReset(),
  { immediate: true }
);
</script>

<style scoped>
.data_permission_field-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.data_permission_field-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.data_permission_field-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.data_permission_field-page__header h2 {
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

.data_permission_field-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.data_permission_field-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
