/**
 * 数据权限模型全局元数据表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 数据权限模型全局元数据表接口
 */
export interface DataPermissionModel extends BaseVo {
  modelName: string;
  moduleCode: string;
  tableName: string;
  remark: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DataPermissionModelPayload {
  id?: number;
  modelName?: string;
  moduleCode?: string;
  tableName?: string;
  remark?: string;
}

/**
 * 数据权限模型全局元数据表查询条件
 */
export interface DataPermissionModelQuery extends BaseSelectListDto {
  modelName?: string;
  moduleCode?: string;
  tableName?: string;
  remark?: string;
}
