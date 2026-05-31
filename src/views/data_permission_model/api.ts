/**
 * 数据权限模型全局元数据表相关 API 服务
 * 提供数据权限模型全局元数据表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { DataPermissionModel, DataPermissionModelPayload, DataPermissionModelQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/**
 * 数据权限模型全局元数据表 API 服务类
 */
export class DataPermissionModelApi {
  /**
   * 获取数据权限模型全局元数据表列表
   * @param params 查询参数（可选）
   * @returns 数据权限模型全局元数据表列表
   */
  static async list(params?: DataPermissionModelQuery): Promise<DataPermissionModel[]> {
    const http = getHttpClient('default');
    const res = await http.get<DataPermissionModel[]>('/department/data_permission_model/list', params);
    return res.data || [];
  }

  /**
   * 分页查询数据权限模型全局元数据表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: DataPermissionModelQuery & PageSelectListDto): Promise<PageData<DataPermissionModel>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<DataPermissionModel>>('/department/data_permission_model/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 数据权限模型全局元数据表 ID
   * @returns 数据权限模型全局元数据表详情
   */
  static async getById(id: number): Promise<DataPermissionModel> {
    const http = getHttpClient('default');
    const res = await http.get<DataPermissionModel>(`/department/data_permission_model/${id}`);
    return res.data;
  }

  /**
   * 保存数据权限模型全局元数据表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 数据权限模型全局元数据表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的数据权限模型全局元数据表
   */
  static async save(payload: DataPermissionModelPayload): Promise<DataPermissionModel> {
    const http = getHttpClient('default');
    const res = await http.post<DataPermissionModel>('/department/data_permission_model/save', payload);
    return res.data;
  }

  /**
   * 删除数据权限模型全局元数据表
   * @param id 数据权限模型全局元数据表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/department/data_permission_model/${id}`);
  }
}

