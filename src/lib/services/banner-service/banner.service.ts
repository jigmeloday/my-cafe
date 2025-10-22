import { ApiResponse, BannerType } from '../../../../types';
import { baseAPI } from '../base-api';

export const createBannerApi = async (payload: BannerType): Promise<ApiResponse<BannerType>> => {
  try{
    return await baseAPI('/banner', 'POST', payload)
  } catch(error) {
    return {
      success: false,
      message: 'Something went wrong',
    }
  }
}

export const updateBannerApi = async (payload: BannerType, id: string): Promise<ApiResponse<BannerType>> => {
  try{
    return await baseAPI(`/banner/${id}`, 'PUT', payload)
  } catch(error) {
    return {
      success: false,
      message: 'Something went wrong',
    }
  }
}