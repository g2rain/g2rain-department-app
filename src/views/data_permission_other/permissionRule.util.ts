export interface PermissionRuleRow {
  fieldName: string;
  valuesText: string;
}

/**
 * 权限规则值解析
 *
 * 约定：
 * - 用户输入：仅英文/中文逗号分隔多个值，词内空格保留
 * - 包装符（仅剥离值首尾）：空白、逗号、ASCII/弯引号/全角引号
 * - SQL 生成：单值 `field = 'x'`，多值 `field IN ('x','y')`
 * - SQL 还原：按 AND 拆段，解析 IN / = 后还原为逗号分隔表单文本
 */

/** 多值之间的分隔符 */
const VALUE_DELIMITERS = new Set([',', '，']);

/** 值首尾可剥离的包装符（不含词内字符） */
const WRAPPER_CHAR = /[\s,，'"\u2018\u2019\u201C\u201D`\uFF07\uFF02]/;

function isWrapperChar(char: string): boolean {
  return char.length === 1 && WRAPPER_CHAR.test(char);
}

/** 剥离单个值首尾的空白、逗号与各类引号，保留词内空格 */
export function normalizeValue(raw: string): string {
  let result = raw;
  let prev = '';
  while (prev !== result) {
    prev = result;
    let start = 0;
    let end = result.length;
    while (start < end && isWrapperChar(result[start])) {
      start += 1;
    }
    while (end > start && isWrapperChar(result[end - 1])) {
      end -= 1;
    }
    result = result.slice(start, end);
  }
  return result;
}

/** 将用户输入拆分为干净的字段值列表 */
export function parseValuesText(text: string): string[] {
  if (!text.trim()) {
    return [];
  }

  const values: string[] = [];
  let buffer = '';

  for (const char of text) {
    if (VALUE_DELIMITERS.has(char)) {
      const value = normalizeValue(buffer);
      if (value) {
        values.push(value);
      }
      buffer = '';
      continue;
    }
    buffer += char;
  }

  const last = normalizeValue(buffer);
  if (last) {
    values.push(last);
  }
  return values;
}

export function formatValuesText(values: string[]): string {
  return values.join(',');
}

function escapeSqlValue(value: string): string {
  return value.replace(/'/g, "''");
}

function quoteSqlValue(value: string): string {
  return `'${escapeSqlValue(value)}'`;
}

function buildFieldCondition(fieldName: string, values: string[]): string {
  if (values.length === 1) {
    return `${fieldName} = ${quoteSqlValue(values[0])}`;
  }
  return `${fieldName} IN (${values.map(quoteSqlValue).join(',')})`;
}

/** 根据表单行拼接 SQL where 条件 */
export function buildPermissionRule(rows: PermissionRuleRow[]): string {
  return rows
    .filter(row => row.fieldName && row.valuesText.trim())
    .map(row => {
      const values = parseValuesText(row.valuesText);
      if (values.length === 0) {
        return '';
      }
      return buildFieldCondition(row.fieldName, values);
    })
    .filter(Boolean)
    .join(' AND ');
}

/** 解析 SQL IN (...) 或单个 = 右侧的字面量 */
function parseSqlLiteral(raw: string): string {
  const text = raw.trim();
  if (!text) {
    return '';
  }

  if (text.startsWith("'")) {
    let value = '';
    for (let i = 1; i < text.length; i += 1) {
      const char = text[i];
      if (char === "'") {
        if (text[i + 1] === "'") {
          value += "'";
          i += 1;
          continue;
        }
        return value;
      }
      value += char;
    }
    return normalizeValue(value);
  }

  if (text.startsWith('"')) {
    let value = '';
    for (let i = 1; i < text.length; i += 1) {
      const char = text[i];
      if (char === '"') {
        if (text[i + 1] === '"') {
          value += '"';
          i += 1;
          continue;
        }
        return value;
      }
      value += char;
    }
    return normalizeValue(value);
  }

  return normalizeValue(text);
}

/** 解析 SQL IN 子句中的值列表 */
function parseSqlInValues(content: string): string[] {
  const values: string[] = [];
  let i = 0;

  while (i < content.length) {
    while (i < content.length && (/\s/.test(content[i]) || content[i] === ',')) {
      i += 1;
    }
    if (i >= content.length) {
      break;
    }

    let end = i;
    if (content[i] === "'" || content[i] === '"') {
      const quote = content[i];
      end = i + 1;
      while (end < content.length) {
        if (content[end] === quote) {
          if (content[end + 1] === quote) {
            end += 2;
            continue;
          }
          end += 1;
          break;
        }
        end += 1;
      }
    } else {
      while (end < content.length && content[end] !== ',') {
        end += 1;
      }
    }

    const literal = parseSqlLiteral(content.slice(i, end));
    if (literal) {
      values.push(literal);
    }
    i = end;
  }

  return values.length > 0 ? values : parseValuesText(content);
}

function parseRuleSegment(segment: string): PermissionRuleRow | null {
  const inMatch = segment.match(/^([a-zA-Z_][\w]*)\s+in\s*\((.+)\)$/i);
  if (inMatch) {
    const values = parseSqlInValues(inMatch[2]);
    if (values.length === 0) {
      return null;
    }
    return {
      fieldName: inMatch[1],
      valuesText: formatValuesText(values),
    };
  }

  const eqMatch = segment.match(/^([a-zA-Z_][\w]*)\s*=\s*(.+)$/i);
  if (eqMatch) {
    const value = parseSqlLiteral(eqMatch[2]);
    if (!value) {
      return null;
    }
    return {
      fieldName: eqMatch[1],
      valuesText: value,
    };
  }

  return null;
}

/** 将 permissionRule 按顺序还原为表单行 */
export function parsePermissionRule(rule: string): PermissionRuleRow[] {
  if (!rule.trim()) {
    return [];
  }

  return rule
    .split(/\s+and\s+/i)
    .map(part => parseRuleSegment(part.trim()))
    .filter((row): row is PermissionRuleRow => row != null);
}

export function validatePermissionRuleRows(rows: PermissionRuleRow[]): string | null {
  const activeRows = rows.filter(row => row.fieldName || row.valuesText.trim());
  if (activeRows.length === 0) {
    return '请至少配置一条权限规则';
  }

  for (const row of rows) {
    if (!row.fieldName) {
      return '请选择权限字段';
    }
    if (!row.valuesText.trim()) {
      return '请输入字段值';
    }
    if (parseValuesText(row.valuesText).length === 0) {
      return '请输入有效的字段值';
    }
  }

  const fieldNames = rows.map(row => row.fieldName);
  if (new Set(fieldNames).size !== fieldNames.length) {
    return '权限字段不能重复';
  }

  return null;
}
