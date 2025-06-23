/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = '/auth/login';

export const DEFAULT_ROOT_TREE_ID = '00000000-0000-0000-0000-000000000000';

export interface LanguageOption {
  label: string;
  value: 'en-US' | 'zh-CN';
}

/**
 * Supported languages
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'English',
    value: 'en-US',
  },
];

/**
 * Form open types
 */

export enum FormOpenType {
  CREATE = 'create',
  EDIT = 'edit',
}

export interface FormOpenData {
  id?: number | string;
  type: FormOpenType;
}
