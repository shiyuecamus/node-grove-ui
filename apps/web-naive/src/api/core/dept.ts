import type {
  CommonTimeRangeRequest,
  DeptInfo,
  DeptTree,
  IdType,
} from '@vben/types';

import { CommonStatus } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace DeptApi {
  export const base = '/dept';
  export const list = `${base}/list`;
  export const allTree = `${base}/all-tree`;
  export const lazyLoad = `${base}/lazy-load`;
  export const deleteDept = (id: IdType) => `${base}/${id}`;
  export const getById = (id: IdType) => `${base}/detail/${id}`;
  export const changeStatus = `${base}/change-status`;

  /** dept page params */
  export interface DeptLazyLoadParams extends CommonTimeRangeRequest {
    parentId?: IdType;
    name?: string;
    status?: (typeof CommonStatus)[keyof typeof CommonStatus];
  }
}

/**
 * fetch dept list
 * @returns Promise with dept list response
 */
export async function fetchDeptList() {
  return requestClient.get<DeptInfo[]>(DeptApi.list);
}

/**
 * fetch dept all tree
/**
 * fetch dept all tree
 * @returns Promise with dept all tree response
 */
export async function fetchDeptAllTree() {
  return requestClient.get<DeptTree[]>(DeptApi.allTree);
}

/**
 * fetch dept lazy load
 * @param params - Dept lazy load params
 * @returns Promise with dept lazy load response
 */
export async function fetchDeptLazyLoad(params: DeptApi.DeptLazyLoadParams) {
  return requestClient.get<DeptTree[]>(DeptApi.lazyLoad, {
    params,
  });
}

/**
 * create dept
 * @param data - Dept data
 * @returns Promise with create dept response
 */
export async function createDept(data: DeptInfo) {
  return requestClient.post(DeptApi.base, data);
}

/**
 * update tenant
 * @param data - Tenant data
 * @returns Promise with update tenant response
 */
export async function updateDept(data: DeptInfo) {
  return requestClient.put(DeptApi.base, data);
}

/**
 * delete dept
 * @param id - Dept ID
 * @returns Promise with delete response
 */
export async function deleteDept(id: IdType) {
  return requestClient.delete(DeptApi.deleteDept(id));
}

/**
 * get dept by id
 * @param id - Dept ID
 * @returns Promise with dept response
 */
export async function getDeptById(id: IdType) {
  return requestClient.get<DeptInfo>(DeptApi.getById(id));
}

/**
 * change dept status
 * @param id - Dept ID
 * @param status - Dept status
 * @returns Promise with change status response
 */
export async function changeDeptStatus(
  id: IdType,
  status: (typeof CommonStatus)[keyof typeof CommonStatus],
) {
  return requestClient.put(DeptApi.changeStatus, {
    id,
    status,
  });
}
