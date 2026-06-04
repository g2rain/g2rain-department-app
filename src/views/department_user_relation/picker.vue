<template>
  <div class="department-member-picker">
    <el-form :model="queryForm" :inline="true" class="department-member-picker__search">
      <el-form-item :label="$t('DE_DEPARTMENT_USER_RELATION_FIELD_USER', '用户')">
        <UserSelect
          v-model="queryForm.userId"
          :organ-id="organId"
          :placeholder="$t('DE_DEPARTMENT_USER_RELATION_PH_USER', '请输入姓名/手机号搜索')"
          width="220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
        <el-button @click="handleReset">{{ $t('G2_BTN_RESET', '重置') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="tableRef"
      :data="tableData"
      border
      stripe
      style="width: 100%"
      row-key="userId"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="48" :selectable="isRowSelectable" />
      <el-table-column prop="userId" :label="$t('DE_USER_COL_ID', '用户标识')" width="120" />
      <el-table-column prop="realName" :label="$t('G2_FIELD_REAL_NAME', '姓名')" min-width="140" show-overflow-tooltip />
      <el-table-column prop="mobile" :label="$t('G2_FIELD_MOBILE', '手机号')" width="160" />
    </el-table>

    <div class="department-member-picker__pagination">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, nextTick } from 'vue';
import type { TableInstance } from 'element-plus';
import { t } from '@platform/i18n';
import { DepartmentUserRelationApi } from './api';
import type { DepartmentUserRelation, DepartmentUserRelationQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { UserSelect, showErrorMessage } from '@/components';
import { UserApi } from '../user/api';
import type { User } from '../user/type';

const props = withDefaults(
  defineProps<{
    organId?: number;
    departmentId?: number;
    excludeUserIds?: number[];
  }>(),
  {
    excludeUserIds: () => [],
  },
);

type DepartmentMemberRow = DepartmentUserRelation & { realName?: string; mobile?: string };
type PickedUser = Pick<User, 'id' | 'organId' | 'realName' | 'mobile'>;

const queryForm = reactive({
  userId: undefined as number | undefined,
});

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableRef = ref<TableInstance>();
const tableData = ref<DepartmentMemberRow[]>([]);
const selectedUserMap = ref(new Map<number, PickedUser>());

const excludeUserIdSet = computed(() => new Set(props.excludeUserIds ?? []));

const isRowSelectable = (row: DepartmentMemberRow) => !excludeUserIdSet.value.has(row.userId);

const enrichUserFields = async (records: DepartmentMemberRow[]) => {
  const userIds = [...new Set(records.map(row => row.userId).filter(id => id != null))];
  if (!userIds.length) {
    return;
  }
  const users = await UserApi.listByIds(userIds, props.organId);
  const userMap = new Map(users.map(user => [user.id, user]));
  for (const row of records) {
    const user = userMap.get(row.userId);
    row.realName = user?.realName ?? '';
    row.mobile = user?.mobile ?? '';
  }
};

const loadData = async () => {
  if (props.organId == null || props.departmentId == null) {
    tableData.value = [];
    pagination.total = 0;
    return;
  }

  try {
    const query = Object.fromEntries(
      Object.entries({
        organId: props.organId,
        departmentId: props.departmentId,
        userId: queryForm.userId,
      }).filter(([_, v]) => v != null && !Number.isNaN(v)),
    ) as DepartmentUserRelationQuery;

    const pageData = await DepartmentUserRelationApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DepartmentUserRelationQuery);

    const records = pageData.records ?? [];
    await enrichUserFields(records);
    tableData.value = records;
    pagination.total = pageData.total;
    syncTableSelection();
  } catch (error: any) {
    showErrorMessage(error || t('DE_DEPARTMENT_USER_RELATION_MSG_LOAD_MEMBERS_FAIL', '加载部门成员失败'));
  }
};

const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};

const handleReset = () => {
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

const syncTableSelection = () => {
  nextTick(() => {
    tableRef.value?.clearSelection();
    for (const row of tableData.value) {
      if (selectedUserMap.value.has(row.userId)) {
        tableRef.value?.toggleRowSelection(row, true);
      }
    }
  });
};

const handleSelectionChange = (rows: DepartmentMemberRow[]) => {
  const selectedIds = new Set(rows.map(row => row.userId));
  for (const row of tableData.value) {
    if (excludeUserIdSet.value.has(row.userId)) {
      continue;
    }
    if (selectedIds.has(row.userId)) {
      selectedUserMap.value.set(row.userId, {
        id: row.userId,
        organId: row.organId,
        realName: row.realName ?? '',
        mobile: row.mobile ?? '',
      });
    } else {
      selectedUserMap.value.delete(row.userId);
    }
  }
};

const getSelectedUsers = () => Array.from(selectedUserMap.value.values());

const clearSelection = () => {
  selectedUserMap.value.clear();
  tableRef.value?.clearSelection();
};

watch(
  () => [props.organId, props.departmentId],
  () => {
    pagination.pageNum = 1;
    loadData();
  },
  { immediate: true },
);

watch(
  () => props.excludeUserIds,
  () => {
    for (const userId of excludeUserIdSet.value) {
      selectedUserMap.value.delete(userId);
    }
    syncTableSelection();
  },
  { deep: true },
);

defineExpose({
  getSelectedUsers,
  clearSelection,
  reload: loadData,
});
</script>

<style scoped>
.department-member-picker__search {
  margin-bottom: 12px;
}

.department-member-picker__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
