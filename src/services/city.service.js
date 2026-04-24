import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/cities';

const cityService = {
  /**
   * Create a new city
   * @param {object} payload
   * @param {string} payload.cityName
   * @param {boolean} payload.isActive
   */
  async createCity(payload) {
    try {
      const response = await userRequest.post(API_BASE, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating city:', error);
      throw error;
    }
  },

  /**
   * Fetch cities
   * @param {object} params
   */
  async fetchCities(params) {
    try {
      const response = await userRequest.get(API_BASE, { params });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },
};

export default cityService;
