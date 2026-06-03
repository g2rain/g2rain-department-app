CREATE TABLE `department` (
    `id` BIGINT NOT NULL COMMENT                                                                        '主键标识',
    `parent_id` BIGINT NOT NULL DEFAULT 0 COMMENT                                                       '父部门标识，根节点为0',
    `organ_id` BIGINT NOT NULL COMMENT                                                                  '机构标识',
    `dept_path` VARCHAR(128) NOT NULL COMMENT                                                           '全路径编码，如 00010001',
    `dept_name` VARCHAR(128) NOT NULL COMMENT                                                           '部门名称',
    `leader_user_id` BIGINT NULL COMMENT                                                                '负责人用户标识',
    `status` VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' COMMENT                                              '状态[ACTIVE:有效, INACTIVE:停用]',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT                                                         '部门排序',
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT                                      '创建时间',
    `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT          '更新时间',
    `version` INT NOT NULL DEFAULT 0 COMMENT                                                            '记录版本',
    `delete_flag` TINYINT NOT NULL DEFAULT 0 COMMENT                                                    '删除标识[0:未删除, 1:已删除]',
    PRIMARY KEY (`id`),
    INDEX `idx_organ_dept_path` (`organ_id`,`dept_path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT=                             '部门表';

CREATE TABLE `department_user_relation` (
    `id` BIGINT NOT NULL COMMENT                                                                        '主键标识',
    `organ_id` BIGINT NOT NULL COMMENT                                                                  '机构标识',
    `department_id` BIGINT NOT NULL COMMENT                                                             '部门标识',
    `user_id` BIGINT NOT NULL COMMENT                                                                   '用户标识',
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT                                      '创建时间',
    `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT          '更新时间',
    `version` INT NOT NULL DEFAULT 0 COMMENT                                                            '记录版本',
    `delete_flag` TINYINT NOT NULL DEFAULT 0 COMMENT                                                    '删除标识[0:未删除, 1:已删除]',
    PRIMARY KEY (`id`),
    INDEX `idx_organ_department_user_del` (`organ_id`, `department_id`, `user_id`, `delete_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT=                             '部门人员关系表';

CREATE TABLE `data_permission_model` (
    `id` BIGINT NOT NULL COMMENT                                                                        '主键标识',
    `model_name` VARCHAR(128) NOT NULL COMMENT                                                          '权限模型名称',
    `module_code` VARCHAR(64) NOT NULL COMMENT                                                          '模块编码，如 order, crm, inventory',
    `table_name` VARCHAR(128) NOT NULL COMMENT                                                          '业务表名（建议小写）',
    `remark` VARCHAR(512) NULL COMMENT                                                                  '备注说明（如：订单主表权限模型）',
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT                                      '创建时间',
    `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT          '更新时间',
    `version` INT NOT NULL DEFAULT 0 COMMENT                                                            '记录版本',
    `delete_flag` TINYINT NOT NULL DEFAULT 0 COMMENT                                                    '删除标识[0:未删除, 1:已删除]',
    PRIMARY KEY (`id`),
    INDEX `idx_module_table` (`module_code`, `table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT=                             '数据权限模型全局元数据表';

CREATE TABLE `data_permission_field` (
    `id` BIGINT NOT NULL COMMENT                                                                        '主键标识',
    `model_id` BIGINT NOT NULL COMMENT                                                                  '权限模型标识',
    `field_name` VARCHAR(128) NOT NULL COMMENT                                                          '业务表中的物理字段名，如 dept_path, owner_user_id',
    `field_title` VARCHAR(128) NOT NULL COMMENT                                                         '前端显示的中文标签，如 所属部门, 负责人',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT                                                         '排序',
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT                                      '创建时间',
    `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT          '更新时间',
    `version` INT NOT NULL DEFAULT 0 COMMENT                                                            '记录版本',
    `delete_flag` TINYINT NOT NULL DEFAULT 0 COMMENT                                                    '删除标识[0:未删除, 1:已删除]',
    PRIMARY KEY (`id`),
    INDEX `idx_model_field` (`model_id`, `delete_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT=                             '数据权限模型字段明细表';

CREATE TABLE `data_permission_meta` (
    `id` BIGINT NOT NULL COMMENT                                                                        '主键标识',
    `organ_id` BIGINT NOT NULL COMMENT                                                                  '机构标识',
    `meta_name` VARCHAR(128) NOT NULL COMMENT                                                           '权限策略名称',
    `model_id` BIGINT NOT NULL COMMENT                                                                  '权限模型标识',
    `permission_mode` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT                                       '权限模式[例如 rw]',
    `status` VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' COMMENT                                              '状态[ACTIVE:有效, INACTIVE:停用]',
    `remark` VARCHAR(512) NULL COMMENT                                                                  '备注',
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT                                      '创建时间',
    `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT          '更新时间',
    `version` INT NOT NULL DEFAULT 0 COMMENT                                                            '记录版本',
    `delete_flag` TINYINT NOT NULL DEFAULT 0 COMMENT                                                    '删除标识[0:未删除, 1:已删除]',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT=                             '数据权限元数据表';

CREATE TABLE `data_permission_group` (
    `id` BIGINT NOT NULL COMMENT                                                                        '分组编码',
    `organ_id` BIGINT NOT NULL COMMENT                                                                  '机构标识',
    `dept_path` VARCHAR(128) NOT NULL COMMENT                                                           '所属部门路径编码',
    `group_name` VARCHAR(128) NOT NULL COMMENT                                                          '分组名称',
    `status` VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' COMMENT                                              '状态[ACTIVE:有效, INACTIVE:停用]',
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT                                      '创建时间',
    `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT          '更新时间',
    `version` INT NOT NULL DEFAULT 0 COMMENT                                                            '记录版本',
    `delete_flag` TINYINT NOT NULL DEFAULT 0 COMMENT                                                    '删除标识[0:未删除, 1:已删除]',
    PRIMARY KEY (`id`),
    INDEX `idx_organ_dept` (`organ_id`,`dept_path`, `delete_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT=                             '数据权限小组表';

CREATE TABLE `data_permission_group_user_relation` (
    `id` BIGINT NOT NULL COMMENT                                                                        '主键标识',
    `organ_id` BIGINT NOT NULL COMMENT                                                                  '机构标识',
    `group_id` BIGINT NOT NULL COMMENT                                                                  '分组标识',
    `user_id` BIGINT NOT NULL COMMENT                                                                   '用户标识',
    `status` VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' COMMENT                                              '状态[ACTIVE:有效, INACTIVE:停用]',
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT                                      '创建时间',
    `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT          '更新时间',
    `version` INT NOT NULL DEFAULT 0 COMMENT                                                            '记录版本',
    `delete_flag` TINYINT NOT NULL DEFAULT 0 COMMENT                                                    '删除标识[0:未删除, 1:已删除]',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_group_del` (`user_id`,`group_id`,`delete_flag`),
    KEY `idx_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT=                             '数据权限小组人员关系表';

CREATE TABLE `data_permission_other` (
    `id` BIGINT NOT NULL COMMENT                                                                        '主键标识',
    `meta_id` BIGINT NOT NULL COMMENT                                                                   '关联 data_permission_meta.id',
    `group_id` BIGINT NOT NULL COMMENT                                                                  '分组标识',
    `permission_mode` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT                                       '权限模式[例如 rw]',
    `permission_rule` TEXT NOT NULL COMMENT                                                             '权限规则',
    `status` VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' COMMENT                                              '状态[ACTIVE:有效, INACTIVE:停用]',
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT                                      '创建时间',
    `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT          '更新时间',
    `version` INT NOT NULL DEFAULT 0 COMMENT                                                            '记录版本',
    `delete_flag` TINYINT NOT NULL DEFAULT 0 COMMENT                                                    '删除标识[0:未删除, 1:已删除]',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT=                             '数据权限Other规则表';
