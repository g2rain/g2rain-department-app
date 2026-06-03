/**
 * 数据权限小组表相关 API 服务
 * 提供数据权限小组表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import { DepartmentApi } from '../department/api';
import type { DataPermissionGroup, DataPermissionGroupPayload, DataPermissionGroupQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/**
 * 数据权限小组表 API 服务类
 */
export class DataPermissionGroupApi {
  /**
   * 获取数据权限小组表列表
   * @param params 查询参数（可选）
   * @returns 数据权限小组表列表
   */
  static async list(params?: DataPermissionGroupQuery): Promise<DataPermissionGroup[]> {
    const http = getHttpClient('default');
    const res = await http.get<DataPermissionGroup[]>('/department/data_permission_group/list', params);
    return res.data || [];
  }

  /**
   * 分页查询数据权限小组表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: DataPermissionGroupQuery & PageSelectListDto): Promise<PageData<DataPermissionGroup>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<DataPermissionGroup>>('/department/data_permission_group/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 数据权限小组表 ID
   * @returns 数据权限小组表详情
   */
  static async getById(id: number): Promise<DataPermissionGroup> {
    const http = getHttpClient('default');
    const res = await http.get<DataPermissionGroup>(`/department/data_permission_group/${id}`);
    return res.data;
  }

  /**
   * 保存数据权限小组表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 数据权限小组表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的数据权限小组表
   */
  static async save(payload: DataPermissionGroupPayload): Promise<DataPermissionGroup> {
    const http = getHttpClient('default');
    const res = await http.post<DataPermissionGroup>('/department/data_permission_group/save', payload);
    return res.data;
  }

  /**
   * 删除数据权限小组表
   * @param id 数据权限小组表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/department/data_permission_group/${id}`);
  }

  static async updateStatus(id: number, status: string): Promise<void> {
    const http = getHttpClient('default');
    await http.post(`/department/data_permission_group/${id}/status`, { status });
  }

  /** 按机构查询部门，供下拉选择 deptPath（值为路径编码，展示为部门名称） */
  static createDeptPathSelectMethod(organId?: number) {
    return async (params: { key?: string; value?: string | number }) => {
      if (organId == null) {
        return [];
      }
      if (params.value != null) {
        const depts = await DepartmentApi.list({ organId, deptPath: String(params.value) });
        return depts.map(d => ({ id: d.deptPath, name: d.deptName || d.deptPath }));
      }
      const keyword = params.key?.trim() ?? '';
      const depts = await DepartmentApi.list(keyword ? { organId, deptName: keyword } : { organId });
      return depts.map(d => ({ id: d.deptPath, name: d.deptName || d.deptPath }));
    };
  }
}

