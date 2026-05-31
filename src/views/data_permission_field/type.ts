/**
 * 数据权限模型字段明细表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 数据权限模型字段明细表接口
 */
export interface DataPermissionField extends BaseVo {
  modelId: number;
  fieldName: string;
  fieldTitle: string;
  sortOrder: number;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DataPermissionFieldPayload {
  id?: number; // 更新时传入 ID，新增时不传
  modelId?: number;
  fieldName?: string;
  fieldTitle?: string;
  sortOrder?: number;
}

/**
 * 数据权限模型字段明细表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface DataPermissionFieldQuery extends BaseSelectListDto {
  // 业务查询字段
  modelId?: number;
  fieldName?: string;
  fieldTitle?: string;
  sortOrder?: number;
}

