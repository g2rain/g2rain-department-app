/**
 * 数据权限小组人员关系表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 数据权限小组人员关系表接口
 */
export interface DataPermissionGroupUserRelation extends BaseVo {
  organId: number;
  groupId: number;
  userId: number;
  /** 列表展示用，由前端按 userId 调用户接口补齐 */
  realName?: string;
  mobile?: string;
  status: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DataPermissionGroupUserRelationPayload {
  id?: number; // 更新时传入 ID，新增时不传
  organId?: number;
  groupId?: number;
  userId?: number;
}

/**
 * 数据权限小组人员关系表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface DataPermissionGroupUserRelationQuery extends BaseSelectListDto {
  organId?: number;
  groupId?: number;
  userId?: number;
  status?: string;
}

/** 批量添加小组用户 */
export interface GroupAssignUsersPayload {
  organId: number;
  groupId: number;
  userIds: number[];
}

