/**
 * 部门表相关 API 服务
 * 提供部门表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { Department, DepartmentPayload, DepartmentQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/**
 * 部门表 API 服务类
 */
export class DepartmentApi {
  /**
   * 获取部门表列表
   * @param params 查询参数（可选）
   * @returns 部门表列表
   */
  static async list(params?: DepartmentQuery): Promise<Department[]> {
    const http = getHttpClient('default');
    const res = await http.get<Department[]>('/department/department/list', params);
    return res.data || [];
  }

  /**
   * 分页查询部门表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: DepartmentQuery & PageSelectListDto): Promise<PageData<Department>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<Department>>('/department/department/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 部门表 ID
   * @returns 部门表详情
   */
  static async getById(id: number): Promise<Department> {
    const http = getHttpClient('default');
    const res = await http.get<Department>(`/department/department/${id}`);
    return res.data;
  }

  /**
   * 保存部门表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 部门表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的部门表
   */
  static async save(payload: DepartmentPayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/department/department/save', payload);
    return res.data;
  }

  /**
   * 删除部门表
   * @param id 部门表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/department/department/${id}`);
  }

  static async updateStatus(id: number, status: string): Promise<void> {
    const http = getHttpClient('default');
    await http.post(`/department/department/${id}/status`, { status });
  }
}

