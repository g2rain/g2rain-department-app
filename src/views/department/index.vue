
<template>
  <div class="department-page">
    <el-card class="department-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item label="所属机构">
          <OrganSelect v-model="queryForm.organId" :api-method="OrganApi.searchOrgans" placeholder="请选择所属机构" width="200px" />
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="部门路径">
          <el-input v-model="queryForm.deptPath" placeholder="请输入部门路径" clearable style="width: 200px" />
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

    <div class="department-page__header">
      <div class="department-page__title-group">
        <h2>管理部门数据</h2>
      </div>
      <el-button type="primary" v-permission="'department:add'" @click="handleCreate(undefined)">新增顶级部门</el-button>
    </div>

    <el-table
      :data="treeData"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      border
      style="width: 100%"
    >
      <el-table-column prop="deptName" :label="$t('DEPARTMENT_LIST_DEPT_NAME', '部门名称')" width="180" />
      <el-table-column prop="id" label="部门标识" width="100" />
      <el-table-column prop="organName" label="所属机构" width="140"/>
      <el-table-column prop="deptPath" label="部门路径" width="160" />
      <el-table-column prop="status" label="状态" width="180">
        <template #default="{ row }">
          <StatusSwitch
            v-model="row.status"
            v-permission="'department:status_update'"
            active-value="ACTIVE"
            inactive-value="INACTIVE"
            :options="statusOptions"
            :api-method="({ nextValue }) => DepartmentApi.updateStatus(row.id, String(nextValue))"
            @success="loadData"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sortOrder" label="排序" width="70" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column label="操作" fixed="right" width="300">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'department:edit'" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="success" v-permission="'department:add'" @click="handleCreate(row)">新增子部门</el-button>
          <el-button link type="primary" v-permission="'department:relation_users'" @click="handleDepartmentUsers(row)">关联用户</el-button>
          <el-button link type="danger" v-permission="'department:delete'" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑部门' : '新增部门'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item label="所属机构" prop="organId" v-if="showOrganSelect">
          <OrganSelect v-model="editForm.organId" :api-method="OrganApi.searchOrgans" placeholder="请选择所属机构" width="200px" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="editForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="leaderUserId">
          <UserSelect
            :key="`leader-${editForm.organId ?? 'none'}`"
            v-model="editForm.leaderUserId"
            :organ-id="editForm.organId"
            placeholder="请输入姓名搜索负责人"
            width="100%"
          />
        </el-form-item>
        <el-form-item label="部门排序" prop="sortOrder">
          <el-input-number v-model="editForm.sortOrder" :min="0" :step="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">保 存</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="departmentUserDialogVisible" title="管理部门用户" width="1010px">
      <DepartmentUserRelationPage :department-id="selectedDepartmentId" :organ-id="selectedOrganId" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { DepartmentApi } from './api';
import { OrganApi } from '../organ/api';
import { DictItemApi } from '../dict/api';
import { useCommonStatus } from '../shared/useCommonStatus';
import DepartmentUserRelationPage from '../department_user_relation/index.vue';
import type { Department, DepartmentPayload, DepartmentQuery } from './type';
import { OrganSelect, UserSelect, DictSelect, StatusSwitch, showErrorMessage } from '@/components';

const { statusOptions, loadCommonStatusDict } = useCommonStatus();

type DepartmentTreeNode = Department & { children?: DepartmentTreeNode[] };

const queryForm = reactive({
  organId: undefined as number | undefined,
  deptName: '',
  deptPath: '',
  status: '',
});

const tableData = ref<Department[]>([]);

const treeData = computed(() => {
  const map = new Map<number, DepartmentTreeNode>();
  const tree: DepartmentTreeNode[] = [];

  tableData.value.forEach(item => map.set(item.id!, { ...item, children: [] }));
  tableData.value.forEach(item => {
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(map.get(item.id!)!);
    } else {
      tree.push(map.get(item.id!)!);
    }
  });

  const sortTree = (nodes: DepartmentTreeNode[]) => {
    nodes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    nodes.forEach(n => n.children && sortTree(n.children));
  };

  sortTree(tree);
  return tree;
});

const loadData = async () => {
  try {
    const query = Object.fromEntries(
      Object.entries({ ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as DepartmentQuery;
    tableData.value = await DepartmentApi.list(query);
  } catch (error: any) {
    showErrorMessage(error || '加载列表失败');
  }
};

const handleSearch = () => {
  loadData();
};

const handleReset = () => {
  queryForm.organId = undefined;
  queryForm.deptName = '';
  queryForm.deptPath = '';
  queryForm.status = '';
  loadData();
};

const handleDelete = (row: Department) => {
  ElMessageBox.confirm(`确认删除部门「${row.deptName}」吗？`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        await DepartmentApi.remove(row.id);
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
const showOrganSelect = ref(false);

const editForm = reactive({
  id: undefined as number | undefined,
  parentId: 0,
  organId: undefined as number | undefined,
  deptName: '',
  leaderUserId: undefined as number | undefined,
  sortOrder: 0,
});

const editRules: FormRules = {
  organId: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
  deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请输入部门排序', trigger: 'blur' }],
};

watch(
  () => editForm.organId,
  (_organId, prevOrganId) => {
    if (isEdit.value || prevOrganId == null) return;
    editForm.leaderUserId = undefined;
  },
);

const handleCreate = (row?: Department) => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  showOrganSelect.value = !row;

  editForm.id = undefined;
  editForm.parentId = row?.id ?? 0;
  editForm.organId = row?.organId;
  editForm.deptName = '';
  editForm.leaderUserId = undefined;
  editForm.sortOrder = 0;
  editDialogVisible.value = true;
};

const handleEdit = (row: Department) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  showOrganSelect.value = false;

  editForm.id = row.id;
  editForm.parentId = row.parentId;
  editForm.organId = row.organId;
  editForm.deptName = row.deptName;
  editForm.leaderUserId = row.leaderUserId;
  editForm.sortOrder = row.sortOrder;
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: DepartmentPayload = {
    parentId: editForm.parentId,
    organId: editForm.organId!,
    deptName: editForm.deptName,
    sortOrder: editForm.sortOrder,
  };

  if (editForm.leaderUserId != null) {
    payload.leaderUserId = editForm.leaderUserId;
  }

  try {
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DepartmentApi.save(payload);
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || '保存失败');
  }
};

const departmentUserDialogVisible = ref(false);
const selectedDepartmentId = ref<number | undefined>(undefined);
const selectedOrganId = ref<number | undefined>(undefined);

const handleDepartmentUsers = (row: Department) => {
  selectedDepartmentId.value = row.id;
  selectedOrganId.value = row.organId;
  departmentUserDialogVisible.value = true;
};

onMounted(async () => {
  await loadCommonStatusDict();
  await loadData();
});
</script>

<style scoped>
.department-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.department-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.department-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.department-page__header h2 {
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

.department-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}
</style>
