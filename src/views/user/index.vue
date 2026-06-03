<template>
  <div class="user-picker" :class="{ 'user-picker--embedded': embedded }">
    <el-card v-if="!embedded" class="user-picker__search" shadow="never">
      <el-form :model="queryForm" :inline="true" class="query-form">
        <el-form-item label="所属机构">
          <OrganSelect v-model="queryForm.organId" :api-method="OrganApi.searchOrgans" placeholder="请选择所属机构" width="200px" />
        </el-form-item>
        <el-form-item label="姓名/手机">
          <el-input v-model="queryForm.searchName" placeholder="请输入姓名或手机号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-form v-else :model="queryForm" :inline="true" class="user-picker__inline-search">
      <el-form-item label="姓名/手机">
        <el-input v-model="queryForm.searchName" placeholder="请输入姓名或手机号" clearable style="width: 220px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="tableRef"
      :data="tableData"
      border
      stripe
      style="width: 100%"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="48" :selectable="isRowSelectable" />
      <el-table-column prop="id" label="用户标识" width="120" />
      <el-table-column prop="realName" label="姓名" min-width="140" />
      <el-table-column prop="mobile" label="手机号码" width="160" />
      <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
    </el-table>

    <div class="user-picker__pagination">
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
import { UserApi } from './api';
import { OrganApi } from '../organ/api';
import type { User, UserQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import { OrganSelect, showErrorMessage } from '@/components';

const props = withDefaults(
  defineProps<{
    organId?: number;
    embedded?: boolean;
    excludeUserIds?: number[];
  }>(),
  {
    embedded: false,
    excludeUserIds: () => [],
  },
);

const queryForm = reactive({
  organId: props.organId as number | undefined,
  searchName: '',
});

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableRef = ref<TableInstance>();
const tableData = ref<User[]>([]);
const selectedUserMap = ref(new Map<number, User>());

const excludeUserIdSet = computed(() => new Set(props.excludeUserIds ?? []));

const effectiveOrganId = computed(() => props.organId ?? queryForm.organId);

/** 已关联用户不可勾选，但仍展示在列表中，避免前端过滤导致分页不准 */
const isRowSelectable = (row: User) => !excludeUserIdSet.value.has(row.id);

const buildQuery = (): UserQuery => {
  const query = Object.fromEntries(
    Object.entries({
      organId: effectiveOrganId.value,
      searchName: queryForm.searchName.trim(),
    }).filter(([_, v]) => (v ?? '') !== '' && [v].flat().length),
  ) as UserQuery;
  return query;
};

const loadData = async () => {
  if (effectiveOrganId.value == null) {
    tableData.value = [];
    pagination.total = 0;
    return;
  }

  try {
    const pageData = await UserApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...buildQuery(),
    } as UserQuery & PageSelectListDto);

    tableData.value = pageData.records || [];
    pagination.total = pageData.total;
    syncTableSelection();
  } catch (error: any) {
    showErrorMessage(error || '加载用户列表失败');
  }
};

const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};

const handleReset = () => {
  queryForm.searchName = '';
  if (!props.embedded) {
    queryForm.organId = props.organId;
  }
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
      if (selectedUserMap.value.has(row.id)) {
        tableRef.value?.toggleRowSelection(row, true);
      }
    }
  });
};

const handleSelectionChange = (rows: User[]) => {
  const selectedIds = new Set(rows.map(row => row.id));
  for (const row of tableData.value) {
    if (excludeUserIdSet.value.has(row.id)) {
      continue;
    }
    if (selectedIds.has(row.id)) {
      selectedUserMap.value.set(row.id, row);
    } else {
      selectedUserMap.value.delete(row.id);
    }
  }
};

const getSelectedUsers = () => Array.from(selectedUserMap.value.values());

const clearSelection = () => {
  selectedUserMap.value.clear();
  tableRef.value?.clearSelection();
};

watch(
  () => props.organId,
  organId => {
    queryForm.organId = organId;
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
.user-picker {
  padding: 0;
}

.user-picker--embedded {
  padding: 0;
}

.user-picker__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.user-picker__inline-search {
  margin-bottom: 12px;
}

.user-picker__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
