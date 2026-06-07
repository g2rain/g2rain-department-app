/**
 * 数据权限元数据表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 数据权限元数据表接口
 */
export interface DataPermissionMeta extends BaseVo {
  organId: number;
  /** 网关根据 organId 补全 */
  organName?: string;
  metaName: string;
  modelId: number;
  /** 是否可读（permissionMode bit1） */
  read: boolean;
  /** 是否可写（permissionMode bit0） */
  write: boolean;
  status: string;
  remark: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DataPermissionMetaPayload {
  id?: number;
  organId?: number;
  metaName?: string;
  modelId?: number;
  read?: boolean;
  write?: boolean;
  remark?: string;
}

/**
 * 数据权限元数据表查询条件
 */
export interface DataPermissionMetaQuery extends BaseSelectListDto {
  organId?: number;
  modelId?: number;
  status?: string;
  remark?: string;
}
