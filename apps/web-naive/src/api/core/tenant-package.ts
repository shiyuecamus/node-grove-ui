import type {
  CommonPageRequest,
  CommonPageResponse,
  CommonTimeRangeRequest,
  IdType,
  TenantPackageInfo,
} from '@vben/types';

import { CommonStatus } from '@vben/types';

import { requestClient } from '../request';

export namespace TenantPackageApi {
  export const base = '/tenant-package';
  export const list = `${base}/list`;
  export const page = `${base}/page`;
  export const deleteTenantPackage = (id: IdType) => `${base}/${id}`;
  export const getById = (id: IdType) => `${base}/detail/${id}`;
  export const changeStatus = `${base}/change-status`;
  export const getMenuIds = (id: IdType) => `${base}/menu-ids/${id}`;
  export const assignMenus = `${base}/assign-menu`;
  /** tenant package page params */
  export interface TenantPackagePageParams
    extends CommonPageRequest,
      CommonTimeRangeRequest {
    name?: string;
    status?: (typeof CommonStatus)[keyof typeof CommonStatus];
  }
}

/**
 * fetch tenant package list
 * @returns Promise with tenant package list response
 */
export async function fetchTenantPackageList() {
  return requestClient.get<TenantPackageInfo[]>(TenantPackageApi.list);
}

/**
 * fetch tenant package page
 * @param params - Tenant package page params
 * @returns Promise with tenant package page response
 */
export async function fetchTenantPackagePage(
  params: TenantPackageApi.TenantPackagePageParams,
) {
  return requestClient.get<CommonPageResponse<TenantPackageInfo>>(
    TenantPackageApi.page,
    {
      params,
    },
  );
}

/**
 * create tenant package
 * @param data - Tenant package data
 * @returns Promise with create tenant package response
 */
export async function createTenantPackage(data: TenantPackageInfo) {
  return requestClient.post(TenantPackageApi.base, data);
}

/**
 * update tenant package
 * @param data - Tenant package data
 * @returns Promise with update tenant package response
 */
export async function updateTenantPackage(data: TenantPackageInfo) {
  return requestClient.put(TenantPackageApi.base, data);
}

/**
 * delete tenant package
 * @param id - Tenant package id
 * @returns Promise with delete tenant package response
 */
export async function deleteTenantPackage(id: IdType) {
  return requestClient.delete(TenantPackageApi.deleteTenantPackage(id));
}

/**
 * get tenant package by id
 * @param id - Tenant package id
 * @returns Promise with tenant package response
 */
export async function getTenantPackageById(id: IdType) {
  return requestClient.get<TenantPackageInfo>(TenantPackageApi.getById(id));
}

/**
 * change tenant package status
 * @param id - Tenant package id
 * @param status - Tenant package status
 */
export async function changeTenantPackageStatus(
  id: IdType,
  status: (typeof CommonStatus)[keyof typeof CommonStatus],
) {
  return requestClient.put(TenantPackageApi.changeStatus, { id, status });
}

/**
 * get tenant package menu ids
 * @param id - Tenant package id
 * @returns Promise with tenant package menu ids response
 */
export async function getTenantPackageMenuIds(id: IdType) {
  return requestClient.get<Array<number>>(TenantPackageApi.getMenuIds(id));
}

/**
 * asign tenant package menu
 * @param id - Tenant package id
 * @param menuIds - Menu ids
 */
export async function asignTenantPackageMenu(
  id: IdType,
  menuIds: Array<IdType>,
) {
  return requestClient.post(TenantPackageApi.assignMenus, { id, menuIds });
}
