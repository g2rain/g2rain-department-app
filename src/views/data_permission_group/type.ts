/**
 * 数据权限小组表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 数据权限小组表接口
 */
export interface DataPermissionGroup extends BaseVo {
  organId: number;
  deptPath: string;
  groupName: string;
  status: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DataPermissionGroupPayload {
  id?: number; // 更新时传入 ID，新增时不传
  organId?: number;
  deptPath?: string;
  groupName?: string;
  status?: string;
}

/**
 * 数据权限小组表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface DataPermissionGroupQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  deptPath?: string;
  groupName?: string;
  status?: string;
}

