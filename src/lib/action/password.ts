import { ResetPasswordPayload, ResetPasswordResponse } from '../../../types';
import { baseAPI } from '../services/base-api';

export const resetPassword = async(payload: {email: string}) => {
  return baseAPI<ResetPasswordResponse>('/auth/request-reset', 'POST', payload);
}

export const validateToken = async(token: string) => {
  return baseAPI<ResetPasswordResponse>(`/auth/validate-reset-token?token=${token}`, 'GET');
}

export const setPassword = async(payload: ResetPasswordPayload) => {
  return baseAPI<ResetPasswordResponse>('/auth/reset-password', 'POST', payload);
}