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
  /** 是否可读（permissionMode bit1） */
  read: boolean;
  /** 是否可写（permissionMode bit0） */
  write: boolean;
  permissionRule: string;
  status: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DataPermissionOtherPayload {
  id?: number;
  metaId?: number;
  groupId?: number;
  read?: boolean;
  write?: boolean;
  permissionRule?: string;
}

/**
 * 数据权限查询条件
 */
export interface DataPermissionOtherQuery extends BaseSelectListDto {
  metaId?: number;
  groupId?: number;
  status?: string;
  permissionRule?: string;
}
