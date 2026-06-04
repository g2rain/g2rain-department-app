/**
 * 视图路由映射
 * 仅注册「模板内已有」的示例页面，不包含具体业务系统的页面。
 * 从本模板生成新项目后，在此补充 views 下的页面与 linkPath 的映射即可。
 */

import type { RouteRecordRaw } from 'vue-router';
import { t } from '@platform/i18n';

export interface ViewRouteConfig {
  component: () => Promise<unknown>;
  name?: string;
  meta: {
    titleKey: string;
    titleDefault: string;
    requiresAuth: boolean;
    showInHome?: boolean;
  };
}

function resolveRouteTitle(meta: ViewRouteConfig['meta']): string {
  return t(meta.titleKey, meta.titleDefault);
}

/** 路由路径 -> 视图配置
 * 模板默认不包含任何「system」示例页面。
 * 你可以在子应用生成后按需补充 `views/*` 并在这里注册。
 */
export const routeMap: Record<string, ViewRouteConfig> = {
  '/department': {
    component: () => import('@/views/department/index.vue'),
    name: 'Department',
    meta: {
      titleKey: 'DE_ROUTE_DEPARTMENT',
      titleDefault: '部门',
      requiresAuth: true,
      showInHome: true,
    },
  },
  '/department_user_relation': {
    component: () => import('@/views/department_user_relation/index.vue'),
    name: 'DepartmentUserRelation',
    meta: {
      titleKey: 'DE_ROUTE_DEPARTMENT_USER_RELATION',
      titleDefault: '部门人员关系',
      requiresAuth: true,
      showInHome: true,
    },
  },
  '/data_permission_model': {
    component: () => import('@/views/data_permission_model/index.vue'),
    name: 'DataPermissionModel',
    meta: {
      titleKey: 'DE_ROUTE_DATA_PERMISSION_MODEL',
      titleDefault: '数据权限模型',
      requiresAuth: true,
      showInHome: true,
    },
  },
  '/data_permission_field': {
    component: () => import('@/views/data_permission_field/index.vue'),
    name: 'DataPermissionField',
    meta: {
      titleKey: 'DE_ROUTE_DATA_PERMISSION_FIELD',
      titleDefault: '数据权限字段',
      requiresAuth: true,
      showInHome: true,
    },
  },
  '/data_permission_meta': {
    component: () => import('@/views/data_permission_meta/index.vue'),
    name: 'DataPermissionMeta',
    meta: {
      titleKey: 'DE_ROUTE_DATA_PERMISSION_META',
      titleDefault: '数据权限元数据',
      requiresAuth: true,
      showInHome: true,
    },
  },
  '/data_permission_group': {
    component: () => import('@/views/data_permission_group/index.vue'),
    name: 'DataPermissionGroup',
    meta: {
      titleKey: 'DE_ROUTE_DATA_PERMISSION_GROUP',
      titleDefault: '数据权限小组',
      requiresAuth: true,
      showInHome: true,
    },
  },
  '/data_permission_group_user_relation': {
    component: () => import('@/views/data_permission_group_user_relation/index.vue'),
    name: 'DataPermissionGroupUserRelation',
    meta: {
      titleKey: 'DE_ROUTE_DATA_PERMISSION_GROUP_USER_RELATION',
      titleDefault: '数据权限小组人员',
      requiresAuth: true,
      showInHome: true,
    },
  },
  '/data_permission_other': {
    component: () => import('@/views/data_permission_other/index.vue'),
    name: 'DataPermissionOther',
    meta: {
      titleKey: 'DE_ROUTE_DATA_PERMISSION_OTHER',
      titleDefault: '数据权限',
      requiresAuth: true,
      showInHome: true,
    },
  },
};

export function getRouteConfig(): RouteRecordRaw[] {
  return Object.entries(routeMap).map(([path, config]) => {
    const { component, name, meta } = config;
    return {
      path,
      name,
      component,
      meta: { ...meta, title: resolveRouteTitle(meta) },
    } as RouteRecordRaw;
  });
}

export function getRouteComponent(routePath: string): (() => Promise<unknown>) | undefined {
  return routeMap[routePath]?.component;
}

export function getHomeRoutes(): Array<{ path: string; title: string; name?: string }> {
  return Object.entries(routeMap)
    .filter(([path, config]) => {
      if (path === '/' || path === '/home') {
        return false;
      }
      return config.meta.showInHome === true;
    })
    .map(([path, config]) => ({
      path,
      title: resolveRouteTitle(config.meta),
      name: config.name,
    }));
}
