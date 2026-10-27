/**
 * 机构 API（供 OrganSelect / ApiSelect 复用）
 */
import { getHttpClient } from '@/components/http';
import type { OrganIdNameMap } from './type';

export class OrganApi {
  /**
   * 机构搜索（用于 RemoteSelect）
   * - value：按机构标识匹配，同时匹配名称包含该数字的机构
   * - key：按名称关键字匹配
   */
  static async searchOrgans(params: { key?: string; value?: number; signal?: AbortSignal } = {}): Promise<OrganIdNameMap[]> {
    const http = getHttpClient('default');
    const res = await http.get<OrganIdNameMap[]>('/basis/organ/search', { id: params.value, organName: params.key }, { signal: params.signal });
    return res.data || [];
  }

  /** 按机构标识批量查询名称 */
  static async listByIds(organIds: number[]): Promise<OrganIdNameMap[]> {
    const ids = [...new Set(organIds)].filter(id => id != null);
    if (ids.length === 0) {
      return [];
    }
    const http = getHttpClient('default');
    const res = await http.get<{ id: number; organName: string }[]>('/basis/organ/list', { ids });
    return (res.data || []).map(item => ({
      organId: item.id,
      organName: item.organName,
    }));
  }
}
