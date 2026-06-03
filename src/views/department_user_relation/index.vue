
<template>
  <div class="department_user_relation-page">
    <el-card class="department_user_relation-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item v-if="!embedded" label="机构ID">
          <el-input v-model="queryForm.organId" placeholder="请输入机构ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item v-if="!embedded" label="部门ID">
          <el-input v-model="queryForm.departmentId" placeholder="请输入部门ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="用户">
          <UserSelect
            v-model="queryForm.userId"
            :organ-id="effectiveOrganId"
            placeholder="请输入姓名/手机号搜索"
            width="200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="department_user_relation-page__header">
      <div class="department_user_relation-page__title-group">
        <h2>管理部门用户</h2>
      </div>
      <el-button type="primary" v-permission="'department_user_relation:add'" @click="handleCreate">关联用户</el-button>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column v-if="!embedded" prop="organId" label="机构ID" width="140" />
      <el-table-column v-if="!embedded" prop="departmentId" label="部门ID" width="140" />
      <el-table-column prop="userId" label="用户ID" width="120" />
      <el-table-column prop="realName" label="姓名" min-width="120" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号" width="140" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column label="操作" fixed="right" width="80">
        <template #default="{ row }">
          <el-button type="danger" link size="small" v-permission="'department_user_relation:delete'" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="department_user_relation-page__pagination">
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

    <el-dialog v-model="associateDialogVisible" title="关联用户" width="900px" destroy-on-close>
      <UserPicker
        ref="userPickerRef"
        embedded
        :organ-id="effectiveOrganId"
        :exclude-user-ids="linkedUserIds"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="associateDialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="associateSaving" @click="submitAssociate">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, nextTick } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { DepartmentUserRelationApi } from './api';
import type { DepartmentUserRelation, DepartmentUserRelationQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { UserSelect, showErrorMessage } from '@/components';
import UserPicker from '../user/index.vue';
import { UserApi } from '../user/api';

const props = defineProps<{ departmentId?: number; organId?: number }>();

const embedded = computed(() => props.departmentId != null);

const queryForm = reactive({
  organId: props.organId as number | undefined,
  departmentId: props.departmentId as number | undefined,
  userId: undefined as number | undefined,
});

const effectiveOrganId = computed(() => props.organId ?? queryForm.organId);
const effectiveDepartmentId = computed(() => props.departmentId ?? queryForm.departmentId);

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<DepartmentUserRelation[]>([]);

const enrichUserFields = async (records: DepartmentUserRelation[]) => {
  const userIds = [...new Set(records.map(row => row.userId).filter(id => id != null))];
  if (userIds.length === 0) {
    return;
  }

  const users = await UserApi.listByIds(userIds, effectiveOrganId.value);
  const userMap = new Map(users.map(user => [user.id, user]));
  for (const row of records) {
    const user = userMap.get(row.userId);
    row.realName = user?.realName ?? '';
    row.mobile = user?.mobile ?? '';
  }
};

const loadData = async () => {
  try {
    const query = Object.fromEntries(
      Object.entries({ ...queryForm })
        .filter(([_, v]) => v != null && !Number.isNaN(v))
    ) as DepartmentUserRelationQuery;

    const pageData = await DepartmentUserRelationApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DepartmentUserRelationQuery);

    const records = pageData.records ?? [];
    try {
      await enrichUserFields(records);
    } catch (error: any) {
      showErrorMessage(error || '加载用户信息失败');
    }
    tableData.value = records;
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
  queryForm.departmentId = props.departmentId;
  queryForm.userId = undefined;
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

const handleDelete = (row: DepartmentUserRelation) => {
  ElMessageBox.confirm(`确认删除部门用户关联「${row.id}」吗？`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        await DepartmentUserRelationApi.remove(row.id);
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

const associateDialogVisible = ref(false);
const associateSaving = ref(false);
const userPickerRef = ref<InstanceType<typeof UserPicker>>();
const linkedUserIds = ref<number[]>([]);

const handleCreate = async () => {
  if (effectiveOrganId.value == null || effectiveDepartmentId.value == null) {
    ElMessage.error('请先设置机构和部门');
    return;
  }

  try {
    const relations = await DepartmentUserRelationApi.list({
      organId: effectiveOrganId.value,
      departmentId: effectiveDepartmentId.value,
    });
    linkedUserIds.value = relations.map(item => item.userId);
  } catch (error: any) {
    showErrorMessage(error || '加载已关联用户失败');
    return;
  }

  associateDialogVisible.value = true;
  nextTick(() => userPickerRef.value?.clearSelection());
};

const submitAssociate = async () => {
  const users = userPickerRef.value?.getSelectedUsers() ?? [];
  if (users.length === 0) {
    ElMessage.warning('请至少选择一名用户');
    return;
  }

  associateSaving.value = true;
  try {
    const count = await DepartmentUserRelationApi.addUsers({
      organId: effectiveOrganId.value!,
      departmentId: effectiveDepartmentId.value!,
      userIds: users.map(user => user.id),
    });
    if (count === 0) {
      ElMessage.warning('所选用户均已关联，未新增记录');
    } else {
      ElMessage.success(`成功关联 ${count} 名用户`);
    }
    associateDialogVisible.value = false;
    await loadData();
  } catch (error: any) {
    showErrorMessage(error || '关联失败');
  } finally {
    associateSaving.value = false;
  }
};

watch(
  () => [props.departmentId, props.organId],
  () => handleReset(),
  { immediate: true }
);
</script>

<style scoped>
.department_user_relation-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.department_user_relation-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.department_user_relation-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.department_user_relation-page__header h2 {
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

.department_user_relation-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.department_user_relation-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
