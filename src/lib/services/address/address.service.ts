import { AddressType } from '../../../../types';
import { baseAPI } from '../base-api';

export const addAddressApi = async(payload: AddressType) => {
  try{
    return await baseAPI('/address', 'POST', payload)
  } catch(error) {
    console.error(error)
  }
}

export const updateAddressApi = async(payload: AddressType, id: string) => {
  try{
    return await baseAPI(`/address/${id}`, 'PUT', payload)
  } catch(error) {
    console.log(error)
  }
}