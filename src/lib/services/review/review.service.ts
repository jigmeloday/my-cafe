import { FetchReviewListResponse } from '../../../../types';
import { baseAPI } from '../base-api';

export const fetchReviewList = async ({
  limit,
  page,
  cafeId
}: {
  limit: number;
  page: number;
  cafeId: string
}):Promise<FetchReviewListResponse> => {
  try {
    const response = await baseAPI(
      `/review?limit=${limit || 10}&page=${page}&cafeId=${cafeId}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to fetch', data: null };
  }
};


export const sendReview = async (payload: { stars: number; comment: string; reviewableId: string, reviewableType: string }) => {
  try {
    const response = await baseAPI('/review', 'POST', payload); // assuming baseAPI accepts payload as 3rd argument
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    console.error(error);
    return { success: false, message: error?.message || 'Failed to submit review', data: null };
  }
};