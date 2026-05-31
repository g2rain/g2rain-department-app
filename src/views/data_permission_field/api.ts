/**
 * 数据权限模型字段明细表相关 API 服务
 * 提供数据权限模型字段明细表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { DataPermissionField, DataPermissionFieldPayload, DataPermissionFieldQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/**
 * 数据权限模型字段明细表 API 服务类
 */
export class DataPermissionFieldApi {
  /**
   * 获取数据权限模型字段明细表列表
   * @param params 查询参数（可选）
   * @returns 数据权限模型字段明细表列表
   */
  static async list(params?: DataPermissionFieldQuery): Promise<DataPermissionField[]> {
    const http = getHttpClient('default');
    const res = await http.get<DataPermissionField[]>('/department/data_permission_field/list', params);
    return res.data || [];
  }

  /**
   * 分页查询数据权限模型字段明细表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: DataPermissionFieldQuery & PageSelectListDto): Promise<PageData<DataPermissionField>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<DataPermissionField>>('/department/data_permission_field/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 数据权限模型字段明细表 ID
   * @returns 数据权限模型字段明细表详情
   */
  static async getById(id: number): Promise<DataPermissionField> {
    const http = getHttpClient('default');
    const res = await http.get<DataPermissionField>(`/department/data_permission_field/${id}`);
    return res.data;
  }

  /**
   * 保存数据权限模型字段明细表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 数据权限模型字段明细表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的数据权限模型字段明细表
   */
  static async save(payload: DataPermissionFieldPayload): Promise<DataPermissionField> {
    const http = getHttpClient('default');
    const res = await http.post<DataPermissionField>('/department/data_permission_field/save', payload);
    return res.data;
  }

  /**
   * 删除数据权限模型字段明细表
   * @param id 数据权限模型字段明细表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/department/data_permission_field/${id}`);
  }
}

