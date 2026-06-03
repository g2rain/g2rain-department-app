/**
 * 用户相关类型（department-app 调用 basis 用户接口）
 */
import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

export interface User extends BaseVo {
  passportId: number;
  organId: number;
  organName?: string;
  realName: string;
  email: string;
  mobile: string;
  admin: boolean;
}

/** 远程下拉选项 */
export interface UserOption {
  userId: number;
  userName: string;
}

export interface UserQuery extends BaseSelectListDto {
  passportId?: number;
  organId?: number;
  realName?: string;
  email?: string;
  mobile?: string;
  /** 模糊匹配姓名、手机号、用户标识 */
  searchName?: string;
}
