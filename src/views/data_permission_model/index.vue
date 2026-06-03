
<template>
  <div class="data_permission_model-page">
    <el-card class="data_permission_model-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item label="模型名称">
          <el-input v-model="queryForm.modelName" placeholder="请输入模型名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="模块编码">
          <el-input v-model="queryForm.moduleCode" placeholder="请输入模块编码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="业务表名">
          <el-input v-model="queryForm.tableName" placeholder="请输入业务表名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="data_permission_model-page__header">
      <div class="data_permission_model-page__title-group">
        <h2>管理权限模型</h2>
      </div>
      <el-button type="primary" v-permission="'data_permission_model:add'" @click="handleCreate">新增权限模型</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="modelName" label="模型名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="moduleCode" label="模块编码" width="180" />
      <el-table-column prop="tableName" label="业务表名" width="180" />
      <TableColumn prop="createTime" label="创建时间" width="180" :sortable="true" />
      <TableColumn prop="updateTime" label="更新时间" width="180" :sortable="true" />
      <el-table-column label="操作" fixed="right" width="300">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">明细</el-button>
          <el-button type="primary" v-permission="'data_permission_model:edit'" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" v-permission="'data_permission_model:condition_field'" link size="small" @click="handleConditionField(row)">条件字段</el-button>
          <el-button type="danger" v-permission="'data_permission_model:delete'" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>操作</span>
            <SortManagerButton />
          </div>
        </template>
      </el-table-column>
    </SortableTable>

    <div class="data_permission_model-page__pagination">
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

    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑权限模型' : '新增权限模型'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="模型名称" prop="modelName">
          <el-input v-model="editForm.modelName" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="模块编码" prop="moduleCode">
          <el-input v-model="editForm.moduleCode" placeholder="请输入模块编码" />
        </el-form-item>
        <el-form-item label="业务表名" prop="tableName">
          <el-input v-model="editForm.tableName" placeholder="请输入业务表名" />
        </el-form-item>
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="editForm.remark" placeholder="请输入备注说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">保 存</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="权限模型明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="模型名称">{{ currentRow?.modelName }}</el-descriptions-item>
        <el-descriptions-item label="模块编码">{{ currentRow?.moduleCode }}</el-descriptions-item>
        <el-descriptions-item label="业务表名">{{ currentRow?.tableName }}</el-descriptions-item>
        <el-descriptions-item label="备注说明">{{ currentRow?.remark }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentRow?.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="conditionFieldDialogVisible" title="管理条件字段" width="1010px">
      <DataPermissionFieldPage :model-id="selectedModelId" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { DataPermissionModelApi } from './api';
import DataPermissionFieldPage from '../data_permission_field/index.vue';
import type { DataPermissionModel, DataPermissionModelPayload, DataPermissionModelQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { SortableTable, TableColumn, SortManagerButton, showErrorMessage } from '@/components';

const queryForm = reactive({
  modelName: '',
  moduleCode: '',
  tableName: '',
  sorts: undefined as string[] | undefined,
});

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<DataPermissionModel[]>([]);

const loadData = async () => {
  try {
    const query = Object.fromEntries(
      Object.entries({ ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as DataPermissionModelQuery;

    const pageData = await DataPermissionModelApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DataPermissionModelQuery);

    tableData.value = pageData.records;
    pagination.total = pageData.total;
  } catch (error: any) {
    showErrorMessage(error || '加载列表失败');
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
  queryForm.modelName = '';
  queryForm.moduleCode = '';
  queryForm.tableName = '';
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

const currentRow = ref<DataPermissionModel | null>(null);
const detailDialogVisible = ref(false);

const handleView = (row: DataPermissionModel) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

const handleDelete = (row: DataPermissionModel) => {
  ElMessageBox.confirm(`确认删除权限模型「${row.id}」吗？`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        await DataPermissionModelApi.remove(row.id);
        if (tableData.value.length === 1 && pagination.pageNum > 1) {
          pagination.pageNum--;
        }
        await loadData();
        ElMessage.success('删除成功');
      } catch (error: any) {
        showErrorMessage(error || '删除失败');
      }
    })
    .catch(() => {});
};

const editDialogVisible = ref(false);
const isEdit = ref(false);
const editFormRef = ref<FormInstance | null>(null);

const editForm = reactive({
  id: undefined as number | undefined,
  modelName: '',
  moduleCode: '',
  tableName: '',
  remark: '',
});

const editRules: FormRules = {
  modelName: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  moduleCode: [{ required: true, message: '请输入模块编码', trigger: 'blur' }],
  tableName: [{ required: true, message: '请输入业务表名', trigger: 'blur' }],
};

const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  editForm.modelName = '';
  editForm.moduleCode = '';
  editForm.tableName = '';
  editForm.remark = '';
  editDialogVisible.value = true;
};

const handleEdit = (row: DataPermissionModel) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  editForm.id = row.id;
  editForm.modelName = row.modelName;
  editForm.moduleCode = row.moduleCode;
  editForm.tableName = row.tableName;
  editForm.remark = row.remark;
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: DataPermissionModelPayload = {
    modelName: editForm.modelName,
    moduleCode: editForm.moduleCode,
    tableName: editForm.tableName,
    remark: editForm.remark,
  };

  try {
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DataPermissionModelApi.save(payload);
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || '保存失败');
  }
};

const conditionFieldDialogVisible = ref(false);
const selectedModelId = ref<number | undefined>(undefined);

const handleConditionField = (row: DataPermissionModel) => {
  selectedModelId.value = row.id;
  conditionFieldDialogVisible.value = true;
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.data_permission_model-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.data_permission_model-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.data_permission_model-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.data_permission_model-page__header h2 {
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

.data_permission_model-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.data_permission_model-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
