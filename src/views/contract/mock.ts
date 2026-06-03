/**
 * 客户表相关 Mock 数据
 */

import type { AxiosRequestConfig } from 'axios';
import type { MockDataMap } from '@/components/http/mock-data';
import type { Result } from '@/components/http/types';
import Mock from 'mockjs';
import { mockManager } from '@/components/http/mock-data';

/**
 * 生成符合 Result 格式的响应
 */
function createResult<T>(data: T, status: number = 200): Result<T> {
  // 先使用 Mock.mock 生成元数据，然后直接设置 data，避免 data 被 mock 处理
  const result = Mock.mock({
    requestId: '@guid',
    requestTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    status,
    errorCode: status === 200 ? '' : '@word(5,10)',
    errorMessage: status === 200 ? '' : '@cword(5,15)',
  }) as Result<T>;
  
  // 直接设置 data，不经过 Mock.mock 处理
  result.data = data;
  
  return result;
}

/**
 * 生成符合 Contract 类型的 Mock 数据模板
 */
function getContractTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'organId': '@integer(1, 100)',
            'userId': '@integer(1, 100)',
            'deptPath|1': ['@word(3,10)', '@word(3,10)'],
            'contractId': '@integer(1, 100)',
            'status|1': ['@word(3,10)', '@word(3,10)'],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * 客户表相关的 Mock 数据映射
 */
export const ContractMockDataMap: MockDataMap = {
  // GET /contract - 根据条件查询列表
  '/contract': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const userId = query?.userId;
    const deptPath = query?.deptPath;
    const contractId = query?.contractId;
    const status = query?.status;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getContractTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (organId) {
      filteredList = filteredList.filter((item: any) => {
                return item.organId === organId;
              });
    }
    if (userId) {
      filteredList = filteredList.filter((item: any) => {
                return item.userId === userId;
              });
    }
    if (deptPath) {
      filteredList = filteredList.filter((item: any) => {
                return item.deptPath && item.deptPath.includes(deptPath);
              });
    }
    if (contractId) {
      filteredList = filteredList.filter((item: any) => {
                return item.contractId === contractId;
              });
    }
    if (status) {
      filteredList = filteredList.filter((item: any) => {
                return item.status && item.status.includes(status);
              });
    }

    return createResult(filteredList);
  },

  // GET /contract/list - 根据条件查询列表（兼容接口）
  '/contract/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const userId = query?.userId;
    const deptPath = query?.deptPath;
    const contractId = query?.contractId;
    const status = query?.status;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getContractTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (organId) {
      filteredList = filteredList.filter((item: any) => {
                return item.organId === organId;
              });
    }
    if (userId) {
      filteredList = filteredList.filter((item: any) => {
                return item.userId === userId;
              });
    }
    if (deptPath) {
      filteredList = filteredList.filter((item: any) => {
                return item.deptPath && item.deptPath.includes(deptPath);
              });
    }
    if (contractId) {
      filteredList = filteredList.filter((item: any) => {
                return item.contractId === contractId;
              });
    }
    if (status) {
      filteredList = filteredList.filter((item: any) => {
                return item.status && item.status.includes(status);
              });
    }

    return createResult(filteredList);
  },

  // GET /contract/page - 根据条件分页查询
  '/contract/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const organId = query?.query?.organId || query?.organId;
    const userId = query?.query?.userId || query?.userId;
    const deptPath = query?.query?.deptPath || query?.deptPath;
    const contractId = query?.query?.contractId || query?.contractId;
    const status = query?.query?.status || query?.status;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getContractTemplate()],
    };

    const result = Mock.mock(template);

    // 计算总页数
    const totalPages = Math.ceil(total / pageSize);

    const pageData = {
      pageNum,
      pageSize,
      total,
      totalPages,
      records: result.records,
    };

    return createResult(pageData);
  },

  // POST /contract/save - 保存（新增或更新）
  '/contract/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的客户表数据
    const ContractItem = Mock.mock(
      getContractTemplate({
        id,
        organId: payload.organId !== undefined ? payload.organId : '@integer(1, 100)',
        userId: payload.userId !== undefined ? payload.userId : '@integer(1, 100)',
        deptPath: payload.deptPath !== undefined ? payload.deptPath : '@word(3,10)',
        contractId: payload.contractId !== undefined ? payload.contractId : '@integer(1, 100)',
        status: payload.status !== undefined ? payload.status : '@word(3,10)',
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(ContractItem);
  },

  // DELETE /contract/:id - 删除
  '/contract/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(ContractMockDataMap);

