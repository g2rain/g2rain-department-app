
<template>
  <div class="department-page">
    <el-card class="department-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item :label="$t('DE_FIELD_ORGAN', '所属机构')">
          <OrganSelect v-model="queryForm.organId" :api-method="OrganApi.searchOrgans" :placeholder="$t('DE_PH_ORGAN', '请选择所属机构')" width="200px" />
        </el-form-item>
        <el-form-item :label="$t('DE_DEPARTMENT_FIELD_DEPT_NAME', '部门名称')">
          <el-input v-model="queryForm.deptName" :placeholder="$t('DE_DEPARTMENT_PH_DEPT_NAME', '请输入部门名称')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('DE_DEPARTMENT_FIELD_DEPT_PATH', '部门路径')">
          <el-input v-model="queryForm.deptPath" :placeholder="$t('DE_DEPARTMENT_PH_DEPT_PATH', '请输入部门路径')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_STATUS', '状态')">
          <DictSelect v-model="queryForm.status" usage-code="COMMON_STATUS" :api-method="DictItemApi.select" :placeholder="$t('G2_PH_SELECT', '请选择')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
          <el-button @click="handleReset">{{ $t('G2_BTN_RESET', '重置') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="department-page__header">
      <div class="department-page__title-group">
        <h2>{{ $t('DE_DEPARTMENT_TITLE', '管理部门数据') }}</h2>
      </div>
      <el-button type="primary" v-permission="'department:add'" @click="handleCreate(undefined)">{{ $t('DE_DEPARTMENT_BTN_ADD_ROOT', '新增顶级部门') }}</el-button>
    </div>

    <el-table
      :data="treeData"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      border
      style="width: 100%"
    >
      <el-table-column prop="deptName" :label="$t('DE_DEPARTMENT_FIELD_DEPT_NAME', '部门名称')" width="180" />
      <el-table-column prop="id" :label="$t('DE_DEPARTMENT_COL_ID', '部门标识')" width="100" />
      <el-table-column prop="organName" :label="$t('DE_FIELD_ORGAN', '所属机构')" width="140"/>
      <el-table-column prop="deptPath" :label="$t('DE_DEPARTMENT_FIELD_DEPT_PATH', '部门路径')" width="160" />
      <el-table-column prop="status" :label="$t('G2_FIELD_STATUS', '状态')" width="180">
        <template #default="{ row }">
          <StatusSwitch
            v-model="row.status"
            v-permission="'department:status_update'"
            active-value="ACTIVE"
            inactive-value="INACTIVE"
            usage-code="COMMON_STATUS"
            :api-method="({ nextValue }) => DepartmentApi.updateStatus(row.id, String(nextValue))"
            @success="loadData"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sortOrder" :label="$t('G2_LBL_SORT', '排序')" width="70" />
      <el-table-column prop="createTime" :label="$t('G2_FIELD_CREATE_TIME', '创建时间')" width="180" />
      <el-table-column prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="300">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'department:edit'" @click="handleEdit(row)">{{ $t('G2_BTN_EDIT', '编辑') }}</el-button>
          <el-button link type="success" v-permission="'department:add'" @click="handleCreate(row)">{{ $t('DE_DEPARTMENT_BTN_ADD_CHILD', '新增子部门') }}</el-button>
          <el-button link type="primary" v-permission="'department:relation_users'" @click="handleDepartmentUsers(row)">{{ $t('DE_DEPARTMENT_BTN_RELATION_USERS', '关联用户') }}</el-button>
          <el-button link type="danger" v-permission="'department:delete'" @click="handleDelete(row)">{{ $t('G2_BTN_DELETE', '删除') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="editDialogVisible" :title="isEdit ? $t('DE_DEPARTMENT_DLG_EDIT', '编辑部门') : $t('DE_DEPARTMENT_DLG_ADD', '新增部门')" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item :label="$t('DE_FIELD_ORGAN', '所属机构')" prop="organId" v-if="showOrganSelect">
          <OrganSelect v-model="editForm.organId" :api-method="OrganApi.searchOrgans" :placeholder="$t('DE_PH_ORGAN', '请选择所属机构')" width="200px" />
        </el-form-item>
        <el-form-item :label="$t('DE_DEPARTMENT_FIELD_DEPT_NAME', '部门名称')" prop="deptName">
          <el-input v-model="editForm.deptName" :placeholder="$t('DE_DEPARTMENT_PH_DEPT_NAME', '请输入部门名称')" />
        </el-form-item>
        <el-form-item :label="$t('DE_DEPARTMENT_FIELD_LEADER', '负责人')" prop="leaderUserId">
          <UserSelect
            :key="`leader-${editForm.organId ?? 'none'}`"
            v-model="editForm.leaderUserId"
            :organ-id="editForm.organId"
            :placeholder="$t('DE_DEPARTMENT_PH_LEADER', '请输入姓名搜索负责人')"
            width="100%"
          />
        </el-form-item>
        <el-form-item :label="$t('DE_DEPARTMENT_FIELD_SORT_ORDER', '部门排序')" prop="sortOrder">
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

    <el-dialog v-model="departmentUserDialogVisible" :title="$t('DE_DEPARTMENT_DLG_MANAGE_USERS', '管理部门用户')" width="1010px">
      <DepartmentUserRelationPage :department-id="selectedDepartmentId" :organ-id="selectedOrganId" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { t } from '@platform/i18n';
import { DepartmentApi } from './api';
import { OrganApi } from '../organ/api';
import { DictItemApi } from '../dict/api';
import DepartmentUserRelationPage from '../department_user_relation/index.vue';
import type { Department, DepartmentPayload, DepartmentQuery } from './type';
import { OrganSelect, UserSelect, DictSelect, StatusSwitch, showErrorMessage } from '@/components';

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
    showErrorMessage(error || t('G2_MSG_LOAD_FAIL', '加载列表失败'));
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
  ElMessageBox.confirm(
    t('DE_DEPARTMENT_DEL_CONFIRM', `确认删除部门「${row.deptName}」吗？`),
    t('G2_LBL_TIP', '提示'),
    { type: 'warning' },
  )
    .then(async () => {
      try {
        await DepartmentApi.remove(row.id);
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
const showOrganSelect = ref(false);

const editForm = reactive({
  id: undefined as number | undefined,
  parentId: 0,
  organId: undefined as number | undefined,
  deptName: '',
  leaderUserId: undefined as number | undefined,
  sortOrder: 0,
});

const editRules = computed<FormRules>(() => ({
  organId: [{ required: true, message: t('DE_PH_ORGAN', '请选择所属机构'), trigger: 'change' }],
  deptName: [{ required: true, message: t('DE_DEPARTMENT_PH_DEPT_NAME', '请输入部门名称'), trigger: 'blur' }],
  sortOrder: [{ required: true, message: t('DE_DEPARTMENT_VLD_SORT_ORDER', '请输入部门排序'), trigger: 'blur' }],
}));

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
    ElMessage.success(isEdit.value ? t('G2_MSG_UPDATE_OK', '更新成功') : t('G2_MSG_ADD_OK', '新增成功'));
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || t('G2_MSG_SAVE_FAIL', '保存失败'));
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
