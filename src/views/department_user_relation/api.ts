/**
 * 部门人员关系表相关 API 服务
 * 提供部门人员关系表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { DepartmentUserRelation, DepartmentUserRelationPayload, DepartmentUserRelationQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/**
 * 部门人员关系表 API 服务类
 */
export class DepartmentUserRelationApi {
  /**
   * 获取部门人员关系表列表
   * @param params 查询参数（可选）
   * @returns 部门人员关系表列表
   */
  static async list(params?: DepartmentUserRelationQuery): Promise<DepartmentUserRelation[]> {
    const http = getHttpClient('default');
    const res = await http.get<DepartmentUserRelation[]>('/department/department_user_relation/list', params);
    return res.data || [];
  }

  /**
   * 分页查询部门人员关系表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: DepartmentUserRelationQuery & PageSelectListDto): Promise<PageData<DepartmentUserRelation>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<DepartmentUserRelation>>('/department/department_user_relation/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 部门人员关系表 ID
   * @returns 部门人员关系表详情
   */
  static async getById(id: number): Promise<DepartmentUserRelation> {
    const http = getHttpClient('default');
    const res = await http.get<DepartmentUserRelation>(`/department/department_user_relation/${id}`);
    return res.data;
  }

  /**
   * 保存部门人员关系表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 部门人员关系表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的部门人员关系表
   */
  static async save(payload: DepartmentUserRelationPayload): Promise<DepartmentUserRelation> {
    const http = getHttpClient('default');
    const res = await http.post<DepartmentUserRelation>('/department/department_user_relation/save', payload);
    return res.data;
  }

  /**
   * 删除部门人员关系表
   * @param id 部门人员关系表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/department/department_user_relation/${id}`);
  }
}

