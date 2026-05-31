/**
 * 数据权限小组人员关系表相关 API 服务
 * 提供数据权限小组人员关系表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { DataPermissionGroupUserRelation, DataPermissionGroupUserRelationPayload, DataPermissionGroupUserRelationQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/**
 * 数据权限小组人员关系表 API 服务类
 */
export class DataPermissionGroupUserRelationApi {
  /**
   * 获取数据权限小组人员关系表列表
   * @param params 查询参数（可选）
   * @returns 数据权限小组人员关系表列表
   */
  static async list(params?: DataPermissionGroupUserRelationQuery): Promise<DataPermissionGroupUserRelation[]> {
    const http = getHttpClient('default');
    const res = await http.get<DataPermissionGroupUserRelation[]>('/department/data_permission_group_user_relation/list', params);
    return res.data || [];
  }

  /**
   * 分页查询数据权限小组人员关系表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: DataPermissionGroupUserRelationQuery & PageSelectListDto): Promise<PageData<DataPermissionGroupUserRelation>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<DataPermissionGroupUserRelation>>('/department/data_permission_group_user_relation/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 数据权限小组人员关系表 ID
   * @returns 数据权限小组人员关系表详情
   */
  static async getById(id: number): Promise<DataPermissionGroupUserRelation> {
    const http = getHttpClient('default');
    const res = await http.get<DataPermissionGroupUserRelation>(`/department/data_permission_group_user_relation/${id}`);
    return res.data;
  }

  /**
   * 保存数据权限小组人员关系表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 数据权限小组人员关系表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的数据权限小组人员关系表
   */
  static async save(payload: DataPermissionGroupUserRelationPayload): Promise<DataPermissionGroupUserRelation> {
    const http = getHttpClient('default');
    const res = await http.post<DataPermissionGroupUserRelation>('/department/data_permission_group_user_relation/save', payload);
    return res.data;
  }

  /**
   * 删除数据权限小组人员关系表
   * @param id 数据权限小组人员关系表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/department/data_permission_group_user_relation/${id}`);
  }
}

