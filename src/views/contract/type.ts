/**
 * 客户表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 客户表接口
 */
export interface Contract extends BaseVo {
  organId: number;
  userId: number;
  deptPath: string;
  contractId: number;
  status: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface ContractPayload {
  id?: number; // 更新时传入 ID，新增时不传
  organId?: number;
  userId?: number;
  deptPath?: string;
  contractId?: number;
  status?: string;
}

/**
 * 客户表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface ContractQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  userId?: number;
  deptPath?: string;
  contractId?: number;
  status?: string;
}

