import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/packages';

const packageService = {
  /**
   * Create a new package
   * @param {object} payload
   * @param {string} payload.packageName
   * @param {number} payload.minCharges
   * @param {number} payload.minRenewalCharges
   * @param {boolean} payload.isActive
   */
  async createPackage(payload) {
    try {
      const response = await userRequest.post(API_BASE, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  },

  /**
   * Fetch packages
   * @param {object} params
   */
  async fetchPackages(params) {
    try {
      const response = await userRequest.get(API_BASE, { params });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  /**
   * Get package by id
   * @param {number|string} id
   */
  async getPackageById(id) {
    try {
      const response = await userRequest.get(`${API_BASE}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching package by id:', error);
      throw error;
    }
  },

  /**
   * Update package by id
   * @param {number|string} id
   * @param {object} payload
   * @param {string} payload.packageName
   * @param {number} payload.minCharges
   * @param {number} payload.minRenewalCharges
   * @param {boolean} payload.isActive
   */
  async updatePackage(id, payload) {
    try {
      const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  },

  /**
   * Delete package by id
   * @param {number|string} id
   */
  async deletePackage(id) {
    try {
      const response = await userRequest.delete(`${API_BASE}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  },
};

export default packageService;
