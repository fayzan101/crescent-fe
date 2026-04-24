export async function deleteAccessory(id: number) {
  try {
    const response = await axios.delete(`${ACCESSORIES_API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
export async function updateAccessory(id: number, accessory: Accessory) {
  try {
    const response = await axios.patch(`${ACCESSORIES_API_URL}/${id}`, accessory, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
import axios from 'axios';

const ACCESSORIES_API_URL = '/api/v1/accessories';

export interface Accessory {
  accessoryName: string;
  isActive: boolean;
}

export async function createAccessory(accessory: Accessory) {
  try {
    const response = await axios.post(ACCESSORIES_API_URL, accessory, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function getAccessories() {
  try {
    const response = await userRequest.get(ACCESSORIES_API_URL);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function getAccessoryById(id: number) {
  try {
    const response = await userRequest.get(`${ACCESSORIES_API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
import { userRequest } from '@/lib/RequestMethods';
