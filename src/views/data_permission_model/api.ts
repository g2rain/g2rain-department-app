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

  static formatModelLabel(model: DataPermissionModel): string {
    return model.modelName || `${model.moduleCode}.${model.id}`;
  }

  /** 权限策略等场景：远程下拉 */
  static async searchForSelect(params: { key?: string; value?: number }): Promise<{ id: number; name: string }[]> {
    const toOption = (model: DataPermissionModel) => ({
      id: model.id,
      name: DataPermissionModelApi.formatModelLabel(model),
    });

    if (params.value != null) {
      const models = await DataPermissionModelApi.list({ id: params.value });
      return models.map(toOption);
    }

    const keyword = params.key?.trim().toLowerCase();
    const models = await DataPermissionModelApi.list();
    if (!keyword) {
      return models.map(toOption);
    }

    return models
      .filter(
        model =>
          DataPermissionModelApi.formatModelLabel(model).toLowerCase().includes(keyword) ||
          model.modelName?.toLowerCase().includes(keyword) ||
          model.moduleCode?.toLowerCase().includes(keyword) ||
          model.tableName?.toLowerCase().includes(keyword) ||
          String(model.id).includes(keyword),
      )
      .map(toOption);
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

