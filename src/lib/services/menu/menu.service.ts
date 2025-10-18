import { ApiResponse, MenuType } from '../../../../types';
import { baseAPI } from '../base-api';

export const createMenuApi = async (
  payload: MenuType
): Promise<ApiResponse<MenuType>> => {
  try {
    return await baseAPI('/menu', 'POST', payload);
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong',
    };
  }
};

export const updateMenuApi = async (
  id: string,
  payload: MenuType
): Promise<ApiResponse<MenuType>> => {
  try {
    return await baseAPI(`/menu/${id}`, 'PUT', payload);
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong',
    };
  }
};

export const fetchMenu = async ({
  limit,
  page,
  category,
  cafeId,
  myCafe,
  discount,
  sortOrder
}: {
  limit?: number;
  page?: number;
  cafeId?: string;
  myCafe?: boolean;
  category?: string | undefined;
  discount?: boolean 
  sortOrder?: 'asc' |'desc'
}): Promise<ApiResponse<MenuType[]>> => {
  try {
    return await baseAPI(
      `/menu?page=${page}&limit=${limit}&category=${category ?? ''}&cafeId=${
        cafeId ?? ''
      }&myCafe=${myCafe ?? false}&discount=${discount}`,
      'GET'
    );
  } catch (error) {
    return { success: false, message: 'Failed to fetch', data: undefined };
  }
};

export const deleteMenuApi = async (id: string) => {
  try {
    return await baseAPI(`/menu/${id}`, 'DELETE');
  } catch (error) {
    return { success: false, message: 'Failed to delete', data: undefined };
  }
};
