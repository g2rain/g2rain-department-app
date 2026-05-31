
<template>
  <div class="data_permission_group-page">
    <el-card class="data_permission_group-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item v-if="!embedded" label="机构ID">
          <el-input v-model="queryForm.organId" placeholder="请输入机构ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="部门路径编码">
          <el-input v-model="queryForm.deptPath" placeholder="请输入部门路径编码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分组名称">
          <el-input v-model="queryForm.groupName" placeholder="请输入分组名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="queryForm.status" placeholder="请输入状态" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="data_permission_group-page__header">
      <div class="data_permission_group-page__title-group">
        <h2>管理权限小组</h2>
      </div>
      <el-button type="primary" v-permission="'data_permission_group:add'" @click="handleCreate">新增权限小组</el-button>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column v-if="!embedded" prop="organId" label="机构ID" width="140" />
      <el-table-column prop="deptPath" label="部门路径编码" width="180" />
      <el-table-column prop="groupName" label="分组名称" width="180" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-button type="primary" link size="small" v-permission="'data_permission_group:edit'" @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" link size="small" @click="handleGroupUsers(row)">关联用户</el-button>
          <el-button type="danger" link size="small" v-permission="'data_permission_group:delete'" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="data_permission_group-page__pagination">
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

    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑权限小组' : '新增权限小组'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item v-if="!embedded" label="机构ID" prop="organId">
          <el-input v-model="editForm.organId" placeholder="请输入机构ID" />
        </el-form-item>
        <el-form-item label="部门路径编码" prop="deptPath">
          <el-input v-model="editForm.deptPath" placeholder="请输入部门路径编码" />
        </el-form-item>
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="editForm.groupName" placeholder="请输入分组名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择状态" style="width: 200px">
            <el-option label="有效" value="ACTIVE" />
            <el-option label="停用" value="INACTIVE" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">保 存</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="groupUserDialogVisible" title="管理关联用户" width="1010px">
      <DataPermissionGroupUserRelationPage :group-id="selectedGroupId" :organ-id="selectedGroupOrganId" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { DataPermissionGroupApi } from './api';
import DataPermissionGroupUserRelationPage from '../data_permission_group_user_relation/index.vue';
import type { DataPermissionGroup, DataPermissionGroupPayload, DataPermissionGroupQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { showErrorMessage } from '@/components';

const props = defineProps<{ organId?: number }>();

const embedded = computed(() => props.organId != null);

const queryForm = reactive({
  organId: props.organId as number | undefined,
  deptPath: '',
  groupName: '',
  status: '',
});

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<DataPermissionGroup[]>([]);

const loadData = async () => {
  try {
    const query = Object.fromEntries(
      Object.entries({ ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as DataPermissionGroupQuery;

    const pageData = await DataPermissionGroupApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DataPermissionGroupQuery);

    tableData.value = pageData.records;
    pagination.total = pageData.total;
  } catch (error: any) {
    showErrorMessage(error || '加载列表失败');
  }
};

const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};

const handleReset = () => {
  queryForm.organId = props.organId;
  queryForm.deptPath = '';
  queryForm.groupName = '';
  queryForm.status = '';
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

const handleDelete = (row: DataPermissionGroup) => {
  ElMessageBox.confirm(`确认删除权限小组「${row.groupName}」吗？`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        await DataPermissionGroupApi.remove(row.id);
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
  organId: props.organId as number | undefined,
  deptPath: '',
  groupName: '',
  status: 'ACTIVE',
});

const editRules: FormRules = {
  organId: [{ required: true, message: '请输入机构标识', trigger: 'blur' }],
  deptPath: [{ required: true, message: '请输入部门路径编码', trigger: 'blur' }],
  groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  editForm.organId = props.organId;
  editForm.deptPath = '';
  editForm.groupName = '';
  editForm.status = 'ACTIVE';
  editDialogVisible.value = true;
};

const handleEdit = (row: DataPermissionGroup) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  editForm.id = row.id;
  editForm.organId = row.organId;
  editForm.deptPath = row.deptPath;
  editForm.groupName = row.groupName;
  editForm.status = row.status;
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  if (!editForm.organId) {
    ElMessage.error('请设置机构');
    return;
  }

  const payload: DataPermissionGroupPayload = {
    organId: editForm.organId,
    deptPath: editForm.deptPath,
    groupName: editForm.groupName,
    status: editForm.status,
  };

  try {
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DataPermissionGroupApi.save(payload);
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || '保存失败');
  }
};

const groupUserDialogVisible = ref(false);
const selectedGroupId = ref<number | undefined>(undefined);
const selectedGroupOrganId = ref<number | undefined>(undefined);

const handleGroupUsers = (row: DataPermissionGroup) => {
  selectedGroupId.value = row.id;
  selectedGroupOrganId.value = row.organId;
  groupUserDialogVisible.value = true;
};

watch(
  () => props.organId,
  () => handleReset(),
  { immediate: true }
);
</script>

<style scoped>
.data_permission_group-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.data_permission_group-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.data_permission_group-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.data_permission_group-page__header h2 {
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

.data_permission_group-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.data_permission_group-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
