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
  sortOrder
}: {
  limit: number;
  page: number;
  active?: boolean;
  feature?: boolean;
  openTime?: string;
  closeTime?: string;
  close?: boolean;
  query?: string;
  sortOrder?: string
}) => {
  try {
    const response = await baseAPI(
      `/cafe?limit=${
        limit || 10
      }&page=${page}&active=${active}&closed=${close}&feature=${feature}&openTime=${openTime}&closeTime=${closeTime}&query=${query}&search=${query}&sort=${sortOrder}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to fetch', data: null };
  }
};
