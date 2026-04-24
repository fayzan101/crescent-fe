export async function deleteDeviceCombo(id: number) {
  try {
    const response = await axios.delete(`${DEVICE_COMBO_API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
export async function updateDeviceCombo(id: number, combo: DeviceCombo) {
  try {
    const response = await axios.patch(`${DEVICE_COMBO_API_URL}/${id}`, combo, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
export async function getDeviceComboById(id: number) {
  try {
    const response = await userRequest.get(`${DEVICE_COMBO_API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
export async function getDeviceCombos() {
  try {
    const response = await userRequest.get(DEVICE_COMBO_API_URL);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
import axios from 'axios';
import { userRequest } from '@/lib/RequestMethods';

const DEVICE_COMBO_API_URL = '/api/v1/device-combos';

export interface DeviceCombo {
  comboName: string;
  isActive: boolean;
}

export async function createDeviceCombo(combo: DeviceCombo) {
  try {
    const response = await axios.post(DEVICE_COMBO_API_URL, combo, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
