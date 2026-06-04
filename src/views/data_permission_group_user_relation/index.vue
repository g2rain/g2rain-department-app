
<template>
  <div class="data_permission_group_user_relation-page">
    <el-card class="data_permission_group_user_relation-page__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item :label="$t('DE_DATA_PERMISSION_GROUP_USER_RELATION_FIELD_USER', '用户')">
          <UserSelect
            v-model="queryForm.userId"
            :organ-id="effectiveOrganId"
            :placeholder="$t('DE_DATA_PERMISSION_GROUP_USER_RELATION_PH_USER', '请输入姓名/手机号搜索')"
            width="200px"
          />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_STATUS', '状态')">
          <DictSelect v-model="queryForm.status" usage-code="COMMON_STATUS" :api-method="DictItemApi.select" :placeholder="$t('DE_DATA_PERMISSION_GROUP_USER_RELATION_PH_STATUS', '请选择状态')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
          <el-button @click="handleReset">{{ $t('G2_BTN_RESET', '重置') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="data_permission_group_user_relation-page__header">
      <div class="data_permission_group_user_relation-page__title-group">
        <h2>{{ $t('DE_DATA_PERMISSION_GROUP_USER_RELATION_TITLE', '管理关联用户') }}</h2>
      </div>
      <el-button type="primary" v-permission="'data_permission_group_user_relation:add'" @click="handleCreate">{{ $t('DE_DATA_PERMISSION_GROUP_USER_RELATION_BTN_ADD', '关联用户') }}</el-button>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" :label="$t('G2_FIELD_ID', 'ID')" width="120" />
      <el-table-column prop="userId" :label="$t('DE_DATA_PERMISSION_GROUP_USER_RELATION_FIELD_USER_ID', '用户ID')" width="120" />
      <el-table-column prop="realName" :label="$t('G2_FIELD_REAL_NAME', '姓名')" min-width="120" show-overflow-tooltip />
      <el-table-column prop="mobile" :label="$t('G2_FIELD_MOBILE', '手机号')" width="140" />
      <el-table-column prop="status" :label="$t('G2_FIELD_STATUS', '状态')" width="180">
        <template #default="{ row }">
          <StatusSwitch
            v-model="row.status"
            v-permission="'data_permission_group_user_relation:status_update'"
            active-value="ACTIVE"
            inactive-value="INACTIVE"
            usage-code="COMMON_STATUS"
            :api-method="({ nextValue }) => DataPermissionGroupUserRelationApi.updateStatus(row.id, String(nextValue))"
            @success="loadData"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('G2_FIELD_CREATE_TIME', '创建时间')" width="180" />
      <el-table-column prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="80">
        <template #default="{ row }">
          <el-button type="danger" link size="small" v-permission="'data_permission_group_user_relation:delete'" @click="handleDelete(row)">{{ $t('G2_BTN_DELETE', '删除') }}</el-button>
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

    <el-dialog v-model="associateDialogVisible" :title="$t('DE_DATA_PERMISSION_GROUP_USER_RELATION_DLG_ADD', '关联用户')" width="900px" destroy-on-close>
      <DepartmentMemberPicker
        ref="memberPickerRef"
        :organ-id="effectiveOrganId"
        :department-id="effectiveDepartmentId"
        :exclude-user-ids="linkedUserIds"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="associateDialogVisible = false">{{ $t('G2_BTN_CANCEL', '取消') }}</el-button>
          <el-button type="primary" :loading="associateSaving" @click="submitAssociate">{{ $t('G2_BTN_SAVE', '保存') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, nextTick } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { t } from '@platform/i18n';
import { DataPermissionGroupUserRelationApi } from './api';
import { DataPermissionGroupApi } from '../data_permission_group/api';
import { DepartmentApi } from '../department/api';
import { DictItemApi } from '../dict/api';
import DepartmentMemberPicker from '../department_user_relation/picker.vue';
import type { DataPermissionGroupUserRelation, DataPermissionGroupUserRelationQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { UserSelect, DictSelect, StatusSwitch, showErrorMessage } from '@/components';
import { UserApi } from '../user/api';

const props = defineProps<{ groupId?: number; organId?: number; departmentId?: number }>();

const resolvedDepartmentId = ref<number | undefined>(props.departmentId);

const effectiveOrganId = computed(() => props.organId);
const effectiveGroupId = computed(() => props.groupId);
const effectiveDepartmentId = computed(() => resolvedDepartmentId.value);

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

const resolveDepartmentId = async () => {
  if (resolvedDepartmentId.value != null || props.groupId == null || props.organId == null) {
    return;
  }
  try {
    const group = await DataPermissionGroupApi.getById(props.groupId);
    const depts = await DepartmentApi.list({ organId: props.organId, deptPath: group.deptPath });
    resolvedDepartmentId.value = depts[0]?.id;
  } catch (error: any) {
    showErrorMessage(error || t('DE_DATA_PERMISSION_GROUP_USER_RELATION_ERR_RESOLVE_DEPT', '解析所属部门失败'));
  }
};

const enrichUserFields = async (records: DataPermissionGroupUserRelation[]) => {
  const userIds = [...new Set(records.map(row => row.userId).filter(id => id != null))];
  if (!userIds.length) {
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
  if (effectiveGroupId.value == null || effectiveOrganId.value == null) {
    tableData.value = [];
    pagination.total = 0;
    return;
  }

  try {
    const query = Object.fromEntries(
      Object.entries({
        organId: effectiveOrganId.value,
        groupId: effectiveGroupId.value,
        userId: queryForm.userId,
        status: queryForm.status,
      }).filter(([_, v]) => v != null && (typeof v !== 'string' || v !== '')),
    ) as DataPermissionGroupUserRelationQuery;

    const pageData = await DataPermissionGroupUserRelationApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DataPermissionGroupUserRelationQuery);

    const records = pageData.records ?? [];
    try {
      await enrichUserFields(records);
    } catch (error: any) {
      showErrorMessage(error || t('DE_DATA_PERMISSION_GROUP_USER_RELATION_ERR_LOAD_USER', '加载用户信息失败'));
    }
    tableData.value = records;
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
  ElMessageBox.confirm(
    t('DE_DATA_PERMISSION_GROUP_USER_RELATION_DEL_CONFIRM', `确认删除关联用户「${row.realName || row.userId}」吗？`),
    t('G2_LBL_TIP', '提示'),
    { type: 'warning' },
  )
    .then(async () => {
      try {
        await DataPermissionGroupUserRelationApi.remove(row.id);
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

const associateDialogVisible = ref(false);
const associateSaving = ref(false);
const memberPickerRef = ref<InstanceType<typeof DepartmentMemberPicker>>();
const linkedUserIds = ref<number[]>([]);

const handleCreate = async () => {
  if (effectiveOrganId.value == null || effectiveGroupId.value == null) {
    ElMessage.error(t('DE_DATA_PERMISSION_GROUP_USER_RELATION_ERR_MISSING_CTX', '缺少机构或小组信息'));
    return;
  }
  if (effectiveDepartmentId.value == null) {
    ElMessage.error(t('DE_DATA_PERMISSION_GROUP_USER_RELATION_ERR_DEPT_UNKNOWN', '无法确定小组所属部门，请检查小组的部门路径配置'));
    return;
  }

  try {
    const relations = await DataPermissionGroupUserRelationApi.list({
      organId: effectiveOrganId.value,
      groupId: effectiveGroupId.value,
    });
    linkedUserIds.value = relations.map(item => item.userId);
  } catch (error: any) {
    showErrorMessage(error || t('DE_DATA_PERMISSION_GROUP_USER_RELATION_ERR_LOAD_LINKED', '加载已关联用户失败'));
    return;
  }

  associateDialogVisible.value = true;
  nextTick(() => memberPickerRef.value?.clearSelection());
};

const submitAssociate = async () => {
  const users = memberPickerRef.value?.getSelectedUsers() ?? [];
  if (users.length === 0) {
    ElMessage.warning(t('DE_DATA_PERMISSION_GROUP_USER_RELATION_WARN_SELECT_USER', '请至少选择一名部门成员'));
    return;
  }

  associateSaving.value = true;
  try {
    const count = await DataPermissionGroupUserRelationApi.addUsers({
      organId: effectiveOrganId.value!,
      groupId: effectiveGroupId.value!,
      userIds: users.map(user => user.id),
    });
    if (count === 0) {
      ElMessage.warning(t('DE_DATA_PERMISSION_GROUP_USER_RELATION_WARN_ALL_LINKED', '所选用户均已关联，未新增记录'));
    } else {
      ElMessage.success(t('DE_DATA_PERMISSION_GROUP_USER_RELATION_MSG_LINK_OK', `成功关联 ${count} 名用户`));
    }
    associateDialogVisible.value = false;
    await loadData();
  } catch (error: any) {
    showErrorMessage(error || t('DE_DATA_PERMISSION_GROUP_USER_RELATION_ERR_LINK_FAIL', '关联失败'));
  } finally {
    associateSaving.value = false;
  }
};

watch(
  () => [props.groupId, props.organId, props.departmentId],
  async () => {
    queryForm.organId = props.organId;
    queryForm.groupId = props.groupId;
    resolvedDepartmentId.value = props.departmentId;
    await resolveDepartmentId();
    handleReset();
  },
  { immediate: true },
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
