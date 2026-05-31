/**
 * 部门表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 部门表接口
 */
export interface Department extends BaseVo {
  parentId: number;
  organId: number;
  deptCode: string;
  deptPath: string;
  deptName: string;
  leaderUserId: number;
  status: string;
  sortOrder: number;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DepartmentPayload {
  id?: number; // 更新时传入 ID，新增时不传
  parentId?: number;
  organId?: number;
  deptCode?: string;
  deptPath?: string;
  deptName?: string;
  leaderUserId?: number;
  status?: string;
  sortOrder?: number;
}

/**
 * 部门表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface DepartmentQuery extends BaseSelectListDto {
  // 业务查询字段
  parentId?: number;
  organId?: number;
  deptCode?: string;
  deptPath?: string;
  deptName?: string;
  leaderUserId?: number;
  status?: string;
  sortOrder?: number;
}

