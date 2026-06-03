
<template>
  <div class="data_permission_meta-page">
    <el-card class="data_permission_meta-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item label="所属机构">
          <OrganSelect v-model="queryForm.organId" :api-method="OrganApi.searchOrgans" placeholder="请选择所属机构" width="200px" />
        </el-form-item>
        <el-form-item label="权限模型">
          <ApiSelect
            v-model="queryForm.modelId"
            :api-method="DataPermissionModelApi.searchForSelect"
            label-key="name"
            placeholder="请选择权限模型"
            allow-empty-keyword
            prefetch-on-open
            width="220px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <DictSelect v-model="queryForm.status" usage-code="COMMON_STATUS" :api-method="DictItemApi.select" placeholder="请选择状态" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="data_permission_meta-page__header">
      <div class="data_permission_meta-page__title-group">
        <h2>管理权限策略</h2>
      </div>
      <el-button type="primary" v-permission="'data_permission_meta:add'" @click="handleCreate">新增权限策略</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="organName" label="所属机构" min-width="160" show-overflow-tooltip />
      <el-table-column prop="metaName" label="策略名称" min-width="160" show-overflow-tooltip />
      <el-table-column label="权限模型" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">{{ resolveModelName(row.modelId) }}</template>
      </el-table-column>
      <el-table-column label="可读" width="80" align="center">
        <template #default="{ row }">{{ row.read ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column label="可写" width="80" align="center">
        <template #default="{ row }">{{ row.write ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="180">
        <template #default="{ row }">
          <StatusSwitch
            v-model="row.status"
            permission="data_permission_meta:status_update"
            active-value="ACTIVE"
            inactive-value="INACTIVE"
            :options="statusOptions"
            :api-method="({ nextValue }) => DataPermissionMetaApi.updateStatus(row.id, String(nextValue))"
            @success="loadData"
          />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      <TableColumn prop="createTime" label="创建时间" width="180" :sortable="true" />
      <TableColumn prop="updateTime" label="更新时间" width="180" :sortable="true" />
      <el-table-column label="操作" fixed="right" width="260">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">明细</el-button>
          <el-button type="success" v-permission="'data_permission_meta:edit'" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" v-permission="'data_permission_meta:delete'" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>操作</span>
            <SortManagerButton />
          </div>
        </template>
      </el-table-column>
    </SortableTable>

    <div class="data_permission_meta-page__pagination">
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

    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑权限策略' : '新增权限策略'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="所属机构" prop="organId">
          <OrganSelect
            v-model="editForm.organId"
            :api-method="OrganApi.searchOrgans"
            placeholder="请选择所属机构"
            width="100%"
          />
        </el-form-item>
        <el-form-item label="策略名称" prop="metaName">
          <el-input v-model="editForm.metaName" placeholder="请输入策略名称" />
        </el-form-item>
        <el-form-item label="权限模型" prop="modelId">
          <ApiSelect
            v-model="editForm.modelId"
            :api-method="DataPermissionModelApi.searchForSelect"
            label-key="name"
            placeholder="请选择权限模型"
            allow-empty-keyword
            prefetch-on-open
            width="100%"
          />
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox v-model="editForm.read">可读</el-checkbox>
          <el-checkbox v-model="editForm.write">可写</el-checkbox>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">保 存</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="权限策略明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="所属机构">{{ currentRow?.organName }}</el-descriptions-item>
        <el-descriptions-item label="策略名称">{{ currentRow?.metaName }}</el-descriptions-item>
        <el-descriptions-item label="权限模型">{{ currentRow ? resolveModelName(currentRow.modelId) : '' }}</el-descriptions-item>
        <el-descriptions-item label="可读">{{ currentRow?.read ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="可写">{{ currentRow?.write ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <DictText :value="currentRow?.status" usage-code="COMMON_STATUS" :api-method="DictItemApi.select" />
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentRow?.remark }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentRow?.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { DataPermissionMetaApi } from './api';
import { DataPermissionModelApi } from '../data_permission_model/api';
import { OrganApi } from '../organ/api';
import { DictItemApi } from '../dict/api';
import { useCommonStatus } from '../shared/useCommonStatus';
import type { DataPermissionMeta, DataPermissionMetaPayload, DataPermissionMetaQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { SortableTable, TableColumn, SortManagerButton, OrganSelect, ApiSelect, DictSelect, StatusSwitch, DictText, showErrorMessage } from '@/components';

const { statusOptions, loadCommonStatusDict } = useCommonStatus();

const modelOptions = ref<Array<{ label: string; value: number }>>([]);

const loadModelOptions = async () => {
  try {
    const models = await DataPermissionModelApi.list();
    modelOptions.value = models.map(model => ({
      value: model.id,
      label: DataPermissionModelApi.formatModelLabel(model),
    }));
  } catch {
    modelOptions.value = [];
  }
};

const resolveModelName = (modelId?: number) =>
  modelOptions.value.find(item => item.value === modelId)?.label ?? (modelId != null ? String(modelId) : '');

const queryForm = reactive({
  organId: undefined as number | undefined,
  modelId: undefined as number | undefined,
  status: '',
  sorts: undefined as string[] | undefined,
});

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<DataPermissionMeta[]>([]);

const loadData = async () => {
  try {
    const query = Object.fromEntries(
      Object.entries({ ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as DataPermissionMetaQuery;

    const pageData = await DataPermissionMetaApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DataPermissionMetaQuery);

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
  queryForm.organId = undefined;
  queryForm.modelId = undefined;
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

const currentRow = ref<DataPermissionMeta | null>(null);
const detailDialogVisible = ref(false);

const handleView = (row: DataPermissionMeta) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

const handleDelete = (row: DataPermissionMeta) => {
  ElMessageBox.confirm(`确认删除权限策略「${row.id}」吗？`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        await DataPermissionMetaApi.remove(row.id);
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
  organId: undefined as number | undefined,
  metaName: '',
  modelId: undefined as number | undefined,
  read: true,
  write: false,
  remark: '',
});

const editRules: FormRules = {
  organId: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
  metaName: [{ required: true, message: '请输入策略名称', trigger: 'blur' }],
  modelId: [{ required: true, message: '请选择权限模型', trigger: 'change' }],
};

const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  editForm.id = undefined;
  editForm.organId = undefined;
  editForm.metaName = '';
  editForm.modelId = undefined;
  editForm.read = true;
  editForm.write = false;
  editForm.remark = '';
  editDialogVisible.value = true;
};

const handleEdit = (row: DataPermissionMeta) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  editForm.id = row.id;
  editForm.organId = row.organId;
  editForm.metaName = row.metaName;
  editForm.modelId = row.modelId;
  editForm.read = row.read;
  editForm.write = row.write;
  editForm.remark = row.remark;
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: DataPermissionMetaPayload = {
    organId: editForm.organId,
    metaName: editForm.metaName,
    modelId: editForm.modelId,
    read: editForm.read,
    write: editForm.write,
    remark: editForm.remark,
  };

  try {
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DataPermissionMetaApi.save(payload);
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || '保存失败');
  }
};

onMounted(async () => {
  await loadCommonStatusDict();
  loadModelOptions();
  loadData();
});
</script>

<style scoped>
.data_permission_meta-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.data_permission_meta-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.data_permission_meta-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.data_permission_meta-page__header h2 {
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

.data_permission_meta-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.data_permission_meta-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
