
<template>
  <div class="data_permission_other-page">
    <!-- 查询表单 -->
    <el-card class="data_permission_other-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <!-- 业务特定查询字段 -->
        <el-form-item label="关联 data_permission_meta.id">
          <el-input v-model="queryForm.metaId" placeholder="请输入关联 data_permission_meta.id" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分组ID">
          <el-input v-model="queryForm.groupId" placeholder="请输入分组ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="权限模式">
          <el-input v-model="queryForm.permissionMode" placeholder="请输入权限模式" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="权限规则">
          <el-input v-model="queryForm.permissionRule" placeholder="请输入权限规则" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="queryForm.status" placeholder="请输入状态" clearable style="width: 200px" />
        </el-form-item>

        <!-- 操作按钮 -->
        <template #actions>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </template>
      </QueryForm>
    </el-card>

    <!-- 标题和操作按钮 -->
    <div class="data_permission_other-page__header">
      <div class="data_permission_other-page__title-group">
        <h2>管理数据权限数据</h2>
      </div>
      <el-button type="primary" v-permission="'data_permission_other:add'" @click="handleCreate">新增数据权限</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="metaId" label="关联 data_permission_meta.id" width="140" />
      <el-table-column prop="groupId" label="分组ID" width="140" />
      <el-table-column prop="permissionMode" label="权限模式" width="140" />
      <el-table-column prop="permissionRule" label="权限规则" width="180" />
      <el-table-column prop="status" label="状态" width="180" />
      <TableColumn prop="createTime" label="创建时间" width="180" :sortable="true" />
      <TableColumn prop="updateTime" label="更新时间" width="180" :sortable="true" />
      <el-table-column label="操作" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">明细</el-button>
          <el-button type="primary" v-permission="'data_permission_other:edit'" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" v-permission="'data_permission_other:delete'" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>操作</span>
            <SortManagerButton />
          </div>
        </template>
      </el-table-column>
    </SortableTable>

    <!-- 分页组件 -->
    <div class="data_permission_other-page__pagination">
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

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑数据权限' : '新增数据权限'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="关联 data_permission_meta.id" prop="metaId">
          <el-input v-model="editForm.metaId" placeholder="请输入关联 data_permission_meta.id" />
        </el-form-item>
        <el-form-item label="分组ID" prop="groupId">
          <el-input v-model="editForm.groupId" placeholder="请输入分组ID" />
        </el-form-item>
        <el-form-item label="权限模式" prop="permissionMode">
          <el-input v-model="editForm.permissionMode" placeholder="请输入权限模式" />
        </el-form-item>
        <el-form-item label="权限规则" prop="permissionRule">
          <el-input v-model="editForm.permissionRule" placeholder="请输入权限规则" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="editForm.status" placeholder="请输入状态" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">保 存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 明细弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="数据权限明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="关联 data_permission_meta.id">{{ currentRow?.metaId }}</el-descriptions-item>
        <el-descriptions-item label="分组ID">{{ currentRow?.groupId }}</el-descriptions-item>
        <el-descriptions-item label="权限模式">{{ currentRow?.permissionMode }}</el-descriptions-item>
        <el-descriptions-item label="权限规则">{{ currentRow?.permissionRule }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ currentRow?.status }}</el-descriptions-item>
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
import { DataPermissionOtherApi } from './api';
import type { DataPermissionOther, DataPermissionOtherPayload, DataPermissionOtherQuery } from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';

import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';

// 组件引用
const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);

// 基础查询表单（BaseSelectListDto）
let baseQueryForm = reactive<BaseSelectListDto>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  sorts: undefined,
});

// 业务查询状态
const queryForm = reactive({
  metaId: undefined,
  groupId: undefined,
  permissionMode: undefined,
  permissionRule: '',
  status: '',
});

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

// 定义列表引用
const tableData = ref<DataPermissionOther[]>([]);

// 加载列表数据
const loadData = async () => {
  try {
    // 合并基础查询 + 业务查询，并过滤空值
    const query = Object.fromEntries(
      Object.entries({ ...baseQueryForm, ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as DataPermissionOtherQuery;
  
    // 请求分页数据
    const pageData = await DataPermissionOtherApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DataPermissionOtherQuery);
      
    // 设置响应结果
    tableData.value = pageData.records;
    pagination.total = pageData.total;
  } catch (error: any) {
    showErrorMessage(error || '加载列表失败');
  }
};

// 处理排序变化
const handleSortChange = (params: Record<string, string>) => {
  // 更新 QueryForm 的 sorts 字段
  queryFormRef.value?.updateSorts(params);
};

// 查询
const handleSearch = () => {
  pagination.pageNum = 1; // 重置到第一页
  loadData();
};

// 重置查询条件
const handleReset = () => {
  // 重置基础查询表单
  baseQueryForm.id = undefined;
  baseQueryForm.createTime = undefined;
  baseQueryForm.updateTime = undefined;
  baseQueryForm.sorts = undefined;
  // 重置业务特定查询表单
  queryForm.metaId = undefined;
  queryForm.groupId = undefined;
  queryForm.permissionMode = undefined;
  queryForm.permissionRule = '';
  queryForm.status = '';
  
  pagination.pageNum = 1; // 重置到第一页
  loadData();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.pageNum = 1; // 重置到第一页
  loadData();
};

// 页码变化
const handlePageChange = (page: number) => {
  pagination.pageNum = page;
  loadData();
};

// 当前记录引用
const currentRow = ref<DataPermissionOther | null>(null);
// 明细弹窗引用
const detailDialogVisible = ref(false);

// 查询数据明细  
const handleView = (row: DataPermissionOther) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除数据记录
const handleDelete = (row: DataPermissionOther) => {
  ElMessageBox.confirm(`确认删除数据权限「${row.id}」吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      try {
        await DataPermissionOtherApi.remove(row.id);
        // 如果当前页只有一条数据，删除后应该跳转到上一页
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

// 保存弹窗引用
const editDialogVisible = ref(false);

// 修改标记状态
const isEdit = ref(false);

// 修改组件引用
const editFormRef = ref<FormInstance | null>(null);

// 保存表单状态   
const editForm = reactive({
  id: undefined as number | undefined,
  metaId: undefined as number | undefined,
  groupId: undefined as number | undefined,
  permissionMode: undefined as number | undefined,
  permissionRule: '',
  status: '',
});

// 表单校验规则
const editRules: FormRules = {
  metaId: [{ required: true, message: '请输入关联 data_permission_meta.id', trigger: 'blur' }],
  groupId: [{ required: true, message: '请输入分组标识', trigger: 'blur' }],
  permissionMode: [{ required: true, message: '请输入权限模式[例如 rw]', trigger: 'blur' }],
  permissionRule: [{ required: true, message: '请输入权限规则', trigger: 'blur' }],
  status: [{ required: true, message: '请输入状态[ACTIVE:有效, INACTIVE:停用]', trigger: 'blur' }],
};

// 打开创建弹窗
const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();

  editForm.metaId = undefined;
  editForm.groupId = undefined;
  editForm.permissionMode = undefined;
  editForm.permissionRule = '';
  editForm.status = '';
  editDialogVisible.value = true;
};

// 打开修改弹窗
const handleEdit = (row: DataPermissionOther) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();

  editForm.id = row.id;
  editForm.metaId = row.metaId;
  editForm.groupId = row.groupId;
  editForm.permissionMode = row.permissionMode;
  editForm.permissionRule = row.permissionRule;
  editForm.status = row.status;
  editDialogVisible.value = true;
};

// 提交数据表单
const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: DataPermissionOtherPayload = {
    metaId: editForm.metaId,
    groupId: editForm.groupId,
    permissionMode: editForm.permissionMode,
    permissionRule: editForm.permissionRule,
    status: editForm.status,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DataPermissionOtherApi.save(payload);
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || '保存失败');
  }
};

// 挂载回调
onMounted(() => {
  // 查询列表
  loadData();
});
</script>

<style scoped>
.data_permission_other-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.data_permission_other-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.data_permission_other-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.data_permission_other-page__header h2 {
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

.data_permission_other-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.data_permission_other-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

