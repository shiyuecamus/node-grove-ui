import type {
  CommonPageRequest,
  CommonPageResponse,
  CommonTimeRangeRequest,
  IdType,
  TenantInfo,
} from '@vben/types';

import { CommonStatus } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace TenantApi {
  export const base = '/tenant';
  export const page = `${base}/page`;
  export const getByDomain = `${base}/by-domain`;
  export const deleteTenant = (id: IdType) => `${base}/${id}`;
  export const getById = (id: IdType) => `${base}/detail/${id}`;
  export const changeStatus = `${base}/change-status`;

  /** tenant page params */
  export interface TenantPageParams
    extends CommonPageRequest,
      CommonTimeRangeRequest {
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
 * create tenant
 * @param data - Tenant data
 * @returns Promise with create tenant response
 */
export async function createTenant(data: TenantInfo) {
  return requestClient.post(TenantApi.base, data);
}

/**
 * update tenant
 * @param data - Tenant data
 * @returns Promise with update tenant response
 */
export async function updateTenant(data: TenantInfo) {
  return requestClient.put(TenantApi.base, data);
}

/**
 * delete tenant
 * @param id - Tenant ID
 * @returns Promise with delete response
 */
export async function deleteTenant(id: IdType) {
  return requestClient.delete(TenantApi.deleteTenant(id));
}

/**
 * get tenant by id
 * @param id - Tenant ID
 * @returns Promise with tenant response
 */
export async function getTenantById(id: IdType) {
  return requestClient.get<TenantInfo>(TenantApi.getById(id));
}

/**
 * change tenant status
 * @param id - Tenant ID
 * @param status - Tenant status
 * @returns Promise with change status response
 */
export async function changeTenantStatus(
  id: IdType,
  status: (typeof CommonStatus)[keyof typeof CommonStatus],
) {
  return requestClient.put(TenantApi.changeStatus, {
    id,
    status,
  });
}
