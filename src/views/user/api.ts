/**
 * 用户 API（department-app 调用 basis，供负责人远程下拉等场景）
 */
import { getHttpClient } from '@/components/http';
import type { User, UserOption, UserQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

const SELECT_PAGE_SIZE = 20;

const toUserOptions = (users: User[]): UserOption[] =>
  users.map(user => ({
    userId: user.id,
    userName: user.realName || String(user.id),
  }));

export class UserApi {
  static async list(params?: UserQuery): Promise<User[]> {
    const http = getHttpClient('default');
    const res = await http.get<User[]>('/basis/user/list', params);
    return res.data || [];
  }

  /** 按用户标识批量查询（走 list + ids） */
  static async listByIds(userIds: number[], organId?: number): Promise<User[]> {
    const ids = [...new Set(userIds)].filter(id => id != null);
    if (ids.length === 0) {
      return [];
    }
    return UserApi.list({ ids, organId });
  }

  static async page(params: UserQuery & PageSelectListDto): Promise<PageData<User>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<User>>('/basis/user/page', params);
    return res.data;
  }

  /**
   * 负责人等场景：按机构 + 关键字远程搜索（兼容 RemoteSelect）
   */
  static async searchForSelect(params: { key?: string; value?: number }, organId?: number | null): Promise<UserOption[]> {
    if (organId == null) {
      return [];
    }

    if (params.value != null) {
      const users = await UserApi.list({ id: params.value, organId });
      return toUserOptions(users);
    }

    const keyword = params.key?.trim();
    if (!keyword) {
      return [];
    }

    const page = await UserApi.page({
      pageNum: 1,
      pageSize: SELECT_PAGE_SIZE,
      organId,
      searchName: keyword,
    });
    return toUserOptions(page.records || []);
  }
}
