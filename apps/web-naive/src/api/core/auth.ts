import { requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface TokenParams {
    password?: string;
    username?: string;
    client_id?: string;
    client_secret?: string;
    grant_type?: string;
    refresh_token?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    access_token: string;
    refresh_token: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.TokenParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/token', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    responseReturn: 'body',
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi(data: AuthApi.TokenParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/token', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    responseReturn: 'body',
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return requestClient.post('/auth/logout', null, {
    withCredentials: true,
    responseReturn: 'body',
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<Array<string>>('/auth/codes');
}
