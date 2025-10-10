import { ResetPasswordResponse } from '../../../types';
import { baseAPI } from '../services/base-api';

export const resetPassword = async(payload: {email: string}) => {
  return baseAPI<ResetPasswordResponse>('/auth/request-reset', 'POST', payload);
}

export const validateToken = async(token: string) => {
  return baseAPI<ResetPasswordResponse>(`/auth/validate-reset-token?token=${token}`, 'GET');
}
