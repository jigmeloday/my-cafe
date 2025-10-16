import { ApiResponse, MenuType } from '../../../../types';
import { baseAPI } from '../base-api';

export const createMenuApi = async (payload: MenuType) => {
  try {
    return await baseAPI('/menu', 'POST', payload);
  } catch (error) {
    return {
      success: false,
      message: error || 'Something went wrong',
    };
  }
};

export const updateMenuApi = async (id: string, payload: MenuType) => {
  try {
    return await baseAPI(`/menu/${id}`, 'PUT', payload);
  } catch (error) {
    return {
      success: false,
      message: error || 'Something went wrong',
    };
  }
};

export const fetchMenu = async ({
  limit,
  page,
  category,
  cafeId,
  myCafe
}: {
  limit?: number;
  page?: number;
  cafeId: string;
  myCafe: boolean;
  category: string | undefined;
}): Promise<ApiResponse<MenuType[]>> => {
  try {
    return await baseAPI(
      `/menu?page=${page}&limit=${limit}&category=${category ?? ''}&cafeId=${cafeId ?? ''}&myCafe=${myCafe}`,
      'GET'
    );
  } catch (error) {
    return { success: false, message: 'Failed to fetch', data: undefined };
  }
};
