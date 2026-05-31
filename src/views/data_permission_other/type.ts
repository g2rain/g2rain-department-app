/**
 * 数据权限相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 数据权限接口
 */
export interface DataPermissionOther extends BaseVo {
  metaId: number;
  groupId: number;
  permissionMode: number;
  permissionRule: string;
  status: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DataPermissionOtherPayload {
  id?: number; // 更新时传入 ID，新增时不传
  metaId?: number;
  groupId?: number;
  permissionMode?: number;
  permissionRule?: string;
  status?: string;
}

/**
 * 数据权限查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface DataPermissionOtherQuery extends BaseSelectListDto {
  // 业务查询字段
  metaId?: number;
  groupId?: number;
  permissionMode?: number;
  permissionRule?: string;
  status?: string;
}

