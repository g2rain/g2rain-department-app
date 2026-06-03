
<template>
  <div class="data_permission_group-page">
    <el-card class="data_permission_group-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item label="所属机构">
          <OrganSelect v-model="queryForm.organId" :api-method="OrganApi.searchOrgans" placeholder="请选择所属机构" width="200px" />
        </el-form-item>
        <el-form-item label="小组名称">
          <el-input v-model="queryForm.groupName" placeholder="请输入小组名称" clearable style="width: 200px" />
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

    <div class="data_permission_group-page__header">
      <div class="data_permission_group-page__title-group">
        <h2>管理权限小组</h2>
      </div>
      <el-button type="primary" v-permission="'data_permission_group:add'" @click="handleCreate">新增权限小组</el-button>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="organName" label="所属机构" min-width="140" show-overflow-tooltip />
      <el-table-column prop="groupName" label="小组名称" width="180" />
      <el-table-column label="所属部门" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">{{ row.deptName ?? row.deptPath }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="180">
        <template #default="{ row }">
          <StatusSwitch
            v-model="row.status"
            v-permission="'data_permission_group:status_update'"
            active-value="ACTIVE"
            inactive-value="INACTIVE"
            :options="statusOptions"
            :api-method="({ nextValue }) => DataPermissionGroupApi.updateStatus(row.id, String(nextValue))"
            @success="loadData"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column label="操作" fixed="right" width="300">
        <template #default="{ row }">
          <el-button type="primary" link size="small" v-permission="'data_permission_group:edit'" @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" link size="small" v-permission="'data_permission_group:relation_users'" @click="handleGroupUsers(row)">关联用户</el-button>
          <el-button type="warning" link size="small" v-permission="'data_permission_group:rule_config'" @click="handleRuleConfig(row)">规则配置</el-button>
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
        <el-form-item label="所属机构" prop="organId">
          <OrganSelect
            v-model="editForm.organId"
            :api-method="OrganApi.searchOrgans"
            placeholder="请选择所属机构"
            width="100%"
          />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptPath">
          <ApiSelect
            :key="`dept-${editForm.organId ?? 'none'}`"
            v-model="editForm.deptPath"
            :api-method="editDeptSelectMethod"
            label-key="name"
            placeholder="请先选择机构，再选择部门"
            allow-empty-keyword
            prefetch-on-open
            width="100%"
          />
        </el-form-item>
        <el-form-item label="小组名称" prop="groupName">
          <el-input v-model="editForm.groupName" placeholder="请输入小组名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">保 存</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="ruleDialogVisible" title="规则配置" width="1010px" destroy-on-close>
      <DataPermissionOtherPage :group-id="selectedGroupId" :organ-id="selectedGroupOrganId" />
    </el-dialog>

    <el-dialog v-model="groupUserDialogVisible" title="管理关联用户" width="1010px" destroy-on-close>
      <DataPermissionGroupUserRelationPage
        :group-id="selectedGroupId"
        :organ-id="selectedGroupOrganId"
        :department-id="selectedDepartmentId"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { DataPermissionGroupApi } from './api';
import { DepartmentApi } from '../department/api';
import { OrganApi } from '../organ/api';
import { DictItemApi } from '../dict/api';
import { useCommonStatus } from '../shared/useCommonStatus';
import DataPermissionGroupUserRelationPage from '../data_permission_group_user_relation/index.vue';
import DataPermissionOtherPage from '../data_permission_other/index.vue';
import type { DataPermissionGroup, DataPermissionGroupPayload, DataPermissionGroupQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { OrganSelect, ApiSelect, DictSelect, StatusSwitch, showErrorMessage } from '@/components';

const { statusOptions, loadCommonStatusDict } = useCommonStatus();

const queryForm = reactive({
  organId: undefined as number | undefined,
  groupName: '',
  status: '',
});

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<DataPermissionGroup[]>([]);

const enrichDeptNames = async (records: DataPermissionGroup[]) => {
  const organIds = [...new Set(records.map(r => r.organId).filter((id): id is number => id != null))];
  if (!organIds.length) {
    return;
  }
  const pathKey = (organId: number, deptPath: string) => `${organId}:${deptPath}`;
  const nameMap = new Map<string, string>();

  await Promise.all(
    organIds.map(async organId => {
      const depts = await DepartmentApi.list({ organId });
      depts.forEach(d => {
        if (d.deptPath) {
          nameMap.set(pathKey(organId, d.deptPath), d.deptName || d.deptPath);
        }
      });
    }),
  );

  records.forEach(row => {
    if (row.organId != null && row.deptPath) {
      row.deptName = nameMap.get(pathKey(row.organId, row.deptPath)) ?? row.deptPath;
    }
  });
};

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

    const records = pageData.records ?? [];
    await enrichDeptNames(records);
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
  queryForm.organId = undefined;
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
  organId: undefined as number | undefined,
  deptPath: '' as string,
  groupName: '',
  status: 'ACTIVE',
});

const editDeptSelectMethod = computed(() => DataPermissionGroupApi.createDeptPathSelectMethod(editForm.organId));

const editRules: FormRules = {
  organId: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
  deptPath: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  groupName: [{ required: true, message: '请输入小组名称', trigger: 'blur' }],
};

watch(
  () => editForm.organId,
  (_organId, prevOrganId) => {
    if (isEdit.value || prevOrganId == null) return;
    editForm.deptPath = '';
  },
);

const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  editForm.id = undefined;
  editForm.organId = undefined;
  editForm.deptPath = '';
  editForm.groupName = '';
  editDialogVisible.value = true;
};

const handleEdit = (row: DataPermissionGroup) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  editForm.id = row.id;
  editForm.organId = row.organId;
  editForm.deptPath = row.deptPath;
  editForm.groupName = row.groupName;
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: DataPermissionGroupPayload = {
    organId: editForm.organId,
    deptPath: editForm.deptPath,
    groupName: editForm.groupName,
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

const ruleDialogVisible = ref(false);
const groupUserDialogVisible = ref(false);
const selectedGroupId = ref<number | undefined>(undefined);
const selectedGroupOrganId = ref<number | undefined>(undefined);
const selectedDepartmentId = ref<number | undefined>(undefined);

const handleRuleConfig = (row: DataPermissionGroup) => {
  selectedGroupId.value = row.id;
  selectedGroupOrganId.value = row.organId;
  ruleDialogVisible.value = true;
};

const handleGroupUsers = async (row: DataPermissionGroup) => {
  selectedGroupId.value = row.id;
  selectedGroupOrganId.value = row.organId;
  selectedDepartmentId.value = undefined;

  try {
    const depts = await DepartmentApi.list({ organId: row.organId, deptPath: row.deptPath });
    selectedDepartmentId.value = depts[0]?.id;
    if (selectedDepartmentId.value == null) {
      ElMessage.error('未找到小组所属部门，请检查部门路径配置');
      return;
    }
    groupUserDialogVisible.value = true;
  } catch (error: any) {
    showErrorMessage(error || '加载所属部门失败');
  }
};

onMounted(async () => {
  await loadCommonStatusDict();
  loadData();
});
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
