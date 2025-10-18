import { ApiResponse, CategoryType } from '../../../types';
import { baseAPI } from './base-api';

export const fetchCategory = async ():Promise<ApiResponse<CategoryType[]>> => {
  try {
   return await baseAPI('/category', 'GET'); // adjust path if needed
  } catch (error) {
    console.error('Failed to fetch categories', error);
    return { message: '', success: false }
  }
};