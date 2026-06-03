/**
 * 视图路由映射（模板项目）
 *
 * 仅注册「模板内已有」的示例页面，不包含具体业务系统的页面。
 * 从本模板生成新项目后，在此补充 views 下的页面与 linkPath 的映射即可。
 */

export interface ViewRouteConfig {
  component: () => Promise<unknown>;
  name?: string;
  meta: {
    title: string;
    requiresAuth: boolean;
    showInHome?: boolean;
  };
}

/** 路由路径 -> 视图配置
 * 模板默认不包含任何「system」示例页面。
 * 你可以在子应用生成后按需补充 `views/*` 并在这里注册。
 */
export const routeMap: Record<string, ViewRouteConfig> = {
  '/department': {
    component: () => import('@/views/department/index.vue'),
    name: 'Department',
    meta: { title: '部门表', requiresAuth: true, showInHome: true },
  },
  '/department_user_relation': {
    component: () => import('@/views/department_user_relation/index.vue'),
    name: 'DepartmentUserRelation',
    meta: { title: '部门人员关系表', requiresAuth: true, showInHome: true },
  },
  '/data_permission_model': {
    component: () => import('@/views/data_permission_model/index.vue'),
    name: 'DataPermissionModel',
    meta: { title: '数据权限模型全局元数据表', requiresAuth: true, showInHome: true },
  },
  '/data_permission_field': {
    component: () => import('@/views/data_permission_field/index.vue'),
    name: 'DataPermissionField',
    meta: { title: '数据权限模型字段明细表', requiresAuth: true, showInHome: true },
  },
  '/data_permission_meta': {
    component: () => import('@/views/data_permission_meta/index.vue'),
    name: 'DataPermissionMeta',
    meta: { title: '数据权限元数据表', requiresAuth: true, showInHome: true },
  },
  '/data_permission_group': {
    component: () => import('@/views/data_permission_group/index.vue'),
    name: 'DataPermissionGroup',
    meta: { title: '数据权限小组表', requiresAuth: true, showInHome: true },
  },
  '/data_permission_group_user_relation': {
    component: () => import('@/views/data_permission_group_user_relation/index.vue'),
    name: 'DataPermissionGroupUserRelation',
    meta: { title: '数据权限小组人员关系表', requiresAuth: true, showInHome: true },
  },
  '/data_permission_other': {
    component: () => import('@/views/data_permission_other/index.vue'),
    name: 'DataPermissionOther',
    meta: { title: '数据权限', requiresAuth: true, showInHome: true },
  }
};

export function getRouteComponent(
  routePath: string,
): (() => Promise<unknown>) | undefined {
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
      title: config.meta.title,
      name: config.name,
    }));
}

