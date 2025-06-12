import type {
  CommonPageRequest,
  CommonPageResponse,
  TenantInfo,
} from '@vben/types';

import { CommonStatus } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace TenantApi {
  export const base = '/tenant';
  export const page = `${base}/page`;
  export const getByDomain = `${base}/by-domain`;
  export const deleteTenant = (id: number | string) => `${base}/${id}`;
  export const getById = (id: number | string) => `${base}/detail/${id}`;
  export const changeStatus = `${base}/change-status`;

  /** tenant page params */
  export interface TenantPageParams extends CommonPageRequest {
    name?: string;
    status?: (typeof CommonStatus)[keyof typeof CommonStatus];
  }
}

/**
 * get current tenant by domain
 * @param domain - Current domain
 * @returns Promise with current tenant response
 */
export async function getCurrentTenantByDomain(domain: string) {
  return requestClient.get<TenantInfo>(TenantApi.getByDomain, {
    params: { domain },
  });
}

/**
 * fetch tenant page
 * @param params - Tenant page params
 * @returns Promise with tenant page response
 */
export async function fetchTenantPage(params: TenantApi.TenantPageParams) {
  return requestClient.get<CommonPageResponse<TenantInfo>>(TenantApi.page, {
    params,
  });
}

/**
 * delete tenant
 * @param id - Tenant ID
 * @returns Promise with delete response
 */
export async function deleteTenant(id: number | string) {
  return requestClient.delete(TenantApi.deleteTenant(id));
}

/**
 * change tenant status
 * @param id - Tenant ID
 * @param status - Tenant status
 * @returns Promise with change status response
 */
export async function changeTenantStatus(
  id: number | string,
  status: (typeof CommonStatus)[keyof typeof CommonStatus],
) {
  return requestClient.post(TenantApi.changeStatus, {
    id,
    status,
  });
}
