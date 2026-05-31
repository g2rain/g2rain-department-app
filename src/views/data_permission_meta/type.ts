/**
 * 数据权限元数据表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 数据权限元数据表接口
 */
export interface DataPermissionMeta extends BaseVo {
  organId: number;
  modelId: number;
  permissionMode: number;
  status: string;
  remark: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DataPermissionMetaPayload {
  id?: number; // 更新时传入 ID，新增时不传
  organId?: number;
  modelId?: number;
  permissionMode?: number;
  status?: string;
  remark?: string;
}

/**
 * 数据权限元数据表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface DataPermissionMetaQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  modelId?: number;
  permissionMode?: number;
  status?: string;
  remark?: string;
}

