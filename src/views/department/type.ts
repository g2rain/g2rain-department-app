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
  /** 网关根据 organId 补全 */
  organName?: string;
  deptPath: string;
  deptName: string;
  leaderUserId: number;
  status: string;
  sortOrder: number;
}

/**
 * 保存部门入参，与后端 DepartmentDto 对齐
 */
export interface DepartmentPayload {
  id?: number;
  parentId?: number;
  organId: number;
  deptName: string;
  leaderUserId?: number;
  sortOrder: number;
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
  deptPath?: string;
  deptName?: string;
  leaderUserId?: number;
  status?: string;
  sortOrder?: number;
}

