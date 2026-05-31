
<template>
  <div class="data_permission_group_user_relation-page">
    <el-card class="data_permission_group_user_relation-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item v-if="!embedded" label="机构ID">
          <el-input v-model="queryForm.organId" placeholder="请输入机构ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item v-if="!embedded" label="分组ID">
          <el-input v-model="queryForm.groupId" placeholder="请输入分组ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="queryForm.userId" placeholder="请输入用户ID" clearable style="width: 200px" />
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

    <div class="data_permission_group_user_relation-page__header">
      <div class="data_permission_group_user_relation-page__title-group">
        <h2>管理关联用户</h2>
      </div>
      <el-button type="primary" v-permission="'data_permission_group_user_relation:add'" @click="handleCreate">新增关联用户</el-button>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column v-if="!embedded" prop="organId" label="机构ID" width="140" />
      <el-table-column v-if="!embedded" prop="groupId" label="分组ID" width="140" />
      <el-table-column prop="userId" label="用户ID" width="140" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column label="操作" fixed="right" width="140">
        <template #default="{ row }">
          <el-button type="primary" link size="small" v-permission="'data_permission_group_user_relation:edit'" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link size="small" v-permission="'data_permission_group_user_relation:delete'" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="data_permission_group_user_relation-page__pagination">
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

    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑关联用户' : '新增关联用户'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item v-if="!embedded" label="机构ID" prop="organId">
          <el-input v-model="editForm.organId" placeholder="请输入机构ID" />
        </el-form-item>
        <el-form-item v-if="!embedded" label="分组ID" prop="groupId">
          <el-input v-model="editForm.groupId" placeholder="请输入分组ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="editForm.userId" placeholder="请输入用户ID" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { DataPermissionGroupUserRelationApi } from './api';
import type { DataPermissionGroupUserRelation, DataPermissionGroupUserRelationPayload, DataPermissionGroupUserRelationQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { showErrorMessage } from '@/components';

const props = defineProps<{ groupId?: number; organId?: number }>();

const embedded = computed(() => props.groupId != null);

const queryForm = reactive({
  organId: props.organId as number | undefined,
  groupId: props.groupId as number | undefined,
  userId: undefined as number | undefined,
  status: '',
});

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<DataPermissionGroupUserRelation[]>([]);

const loadData = async () => {
  try {
    const query = Object.fromEntries(
      Object.entries({ ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as DataPermissionGroupUserRelationQuery;

    const pageData = await DataPermissionGroupUserRelationApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DataPermissionGroupUserRelationQuery);

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
  queryForm.groupId = props.groupId;
  queryForm.userId = undefined;
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

const handleDelete = (row: DataPermissionGroupUserRelation) => {
  ElMessageBox.confirm(`确认删除关联用户「${row.id}」吗？`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        await DataPermissionGroupUserRelationApi.remove(row.id);
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
  groupId: props.groupId as number | undefined,
  userId: undefined as number | undefined,
  status: 'ACTIVE',
});

const editRules: FormRules = {
  organId: [{ required: true, message: '请输入机构标识', trigger: 'blur' }],
  groupId: [{ required: true, message: '请输入分组标识', trigger: 'blur' }],
  userId: [{ required: true, message: '请输入用户标识', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  editForm.organId = props.organId;
  editForm.groupId = props.groupId;
  editForm.userId = undefined;
  editForm.status = 'ACTIVE';
  editDialogVisible.value = true;
};

const handleEdit = (row: DataPermissionGroupUserRelation) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  editForm.id = row.id;
  editForm.organId = row.organId;
  editForm.groupId = row.groupId;
  editForm.userId = row.userId;
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
  if (!editForm.groupId) {
    ElMessage.error('请设置分组');
    return;
  }

  const payload: DataPermissionGroupUserRelationPayload = {
    organId: editForm.organId,
    groupId: editForm.groupId,
    userId: editForm.userId,
    status: editForm.status,
  };

  try {
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DataPermissionGroupUserRelationApi.save(payload);
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || '保存失败');
  }
};

watch(
  () => [props.groupId, props.organId],
  () => handleReset(),
  { immediate: true }
);
</script>

<style scoped>
.data_permission_group_user_relation-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.data_permission_group_user_relation-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.data_permission_group_user_relation-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.data_permission_group_user_relation-page__header h2 {
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

.data_permission_group_user_relation-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.data_permission_group_user_relation-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
