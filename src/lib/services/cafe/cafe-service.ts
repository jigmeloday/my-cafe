import { ApiResponse, CafeType } from '../../../../types';
import { baseAPI } from '../base-api';

export const fetchCafeList = async ({
  limit,
  page,
  active,
  feature,
  close,
  openTime,
  closeTime,
  query,
  sortOrder,
}: {
  limit: number;
  page: number;
  active?: boolean;
  feature?: boolean;
  openTime?: string;
  closeTime?: string;
  close?: boolean;
  query?: string;
  sortOrder?: string;
}): Promise<ApiResponse<CafeType[]>> => {
  try {
    const response = await baseAPI<CafeType[]>(
      `/cafe?limit=${
        limit || 10
      }&page=${page}&active=${active}&closed=${close}&feature=${feature}&openTime=${openTime}&closeTime=${closeTime}&query=${query}&search=${query}&sort=${sortOrder}`,
      'GET'
    );
    return response;
  } catch (error) {
    return { success: false, message: 'Failed to fetch', data: [] };
  }
};

export const createCafeApi = async (payload: CafeType): Promise<ApiResponse<CafeType>> => {
  try {
    const response = await baseAPI<CafeType>('/cafe', 'POST', payload);
    return response;
  } catch (error) {
   return { success: false, message: 'Failed to fetch', data: undefined };
  }
};

export const updateCafeApi = async (id: string, payload: CafeType): Promise<ApiResponse<CafeType>> => {
  try {
    const response = await baseAPI<CafeType>(`/cafe/${id}`, 'PUT', payload);
    return response;
  } catch (error) {
   return { success: false, message: 'Failed to fetch', data: undefined };
  }
};

export const deleteCafeApi = async (id: string): Promise<ApiResponse<CafeType>> => {
  try {
    const response = await baseAPI<CafeType>(`/cafe/${id}`, 'DELETE');
    return response;
  } catch (error) {
   return { success: false, message: 'Failed to fetch', data: undefined };
  }
};

export const getCafeDetails = async (id: string): Promise<ApiResponse<CafeType>> => {
  try{
    return await baseAPI<CafeType>(`/cafe/${id}`, 'GET')
  } catch(error) {
    return { success: false, message: 'Failed to fetch', data: undefined };
  }
}
