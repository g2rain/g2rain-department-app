/**
 * 客户表相关 API 服务
 * 提供客户表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { Contract, ContractPayload, ContractQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

// 导入 mock 数据以触发自动注册（副作用导入）
import './mock';

/**
 * 客户表 API 服务类
 */
export class ContractApi {
  /**
   * 获取客户表列表
   * @param params 查询参数（可选）
   * @returns 客户表列表
   */
  static async list(params?: ContractQuery): Promise<Contract[]> {
    const http = getHttpClient('default');
    const res = await http.get<Contract[]>('/department/contract/list', params);
    return res.data || [];
  }

  /**
   * 分页查询客户表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: ContractQuery & PageSelectListDto): Promise<PageData<Contract>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<Contract>>('/department/contract/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 客户表 ID
   * @returns 客户表详情
   */
  static async getById(id: number): Promise<Contract> {
    const http = getHttpClient('default');
    const res = await http.get<Contract>(`/department/contract/${id}`);
    return res.data;
  }

  /**
   * 保存客户表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 客户表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的客户表
   */
  static async save(payload: ContractPayload): Promise<Contract> {
    const http = getHttpClient('default');
    const res = await http.post<Contract>('/department/contract/save', payload);
    return res.data;
  }

  /**
   * 删除客户表
   * @param id 客户表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/department/contract/${id}`);
  }
}

