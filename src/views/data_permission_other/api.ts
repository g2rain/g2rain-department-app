/**
 * 数据权限相关 API 服务
 * 提供数据权限数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { DataPermissionOther, DataPermissionOtherPayload, DataPermissionOtherQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/**
 * 数据权限 API 服务类
 */
export class DataPermissionOtherApi {
  /**
   * 获取数据权限列表
   * @param params 查询参数（可选）
   * @returns 数据权限列表
   */
  static async list(params?: DataPermissionOtherQuery): Promise<DataPermissionOther[]> {
    const http = getHttpClient('default');
    const res = await http.get<DataPermissionOther[]>('/department/data_permission_other/list', params);
    return res.data || [];
  }

  /**
   * 分页查询数据权限列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: DataPermissionOtherQuery & PageSelectListDto): Promise<PageData<DataPermissionOther>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<DataPermissionOther>>('/department/data_permission_other/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 数据权限 ID
   * @returns 数据权限详情
   */
  static async getById(id: number): Promise<DataPermissionOther> {
    const http = getHttpClient('default');
    const res = await http.get<DataPermissionOther>(`/department/data_permission_other/${id}`);
    return res.data;
  }

  /**
   * 保存数据权限（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 数据权限数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的数据权限
   */
  static async save(payload: DataPermissionOtherPayload): Promise<DataPermissionOther> {
    const http = getHttpClient('default');
    const res = await http.post<DataPermissionOther>('/department/data_permission_other/save', payload);
    return res.data;
  }

  /**
   * 删除数据权限
   * @param id 数据权限 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/department/data_permission_other/${id}`);
  }

  static async updateStatus(id: number, status: string): Promise<void> {
    const http = getHttpClient('default');
    await http.post(`/department/data_permission_other/${id}/status`, { status });
  }
}

