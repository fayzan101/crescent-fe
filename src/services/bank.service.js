import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/banks';

const bankService = {
  /**
   * Create a new bank
   * @param {object} payload
   * @param {string} payload.bankName
   * @param {string} payload.bankCode
   * @param {boolean} payload.isActive
   */
  async createBank(payload) {
    try {
      const response = await userRequest.post(API_BASE, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating bank:', error);
      throw error;
    }
  },

  /**
   * Fetch banks
   * @param {object} params
   */
  async fetchBanks(params) {
    try {
      const response = await userRequest.get(API_BASE, { params });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching banks:', error);
      throw error;
    }
  },

  /**
   * Get bank by id
   * @param {number|string} id
   */
  async getBankById(id) {
    try {
      const response = await userRequest.get(`${API_BASE}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching bank by id:', error);
      throw error;
    }
  },

  /**
   * Update bank by id
   * @param {number|string} id
   * @param {object} payload
   * @param {string} payload.bankName
   * @param {string} payload.bankCode
   * @param {boolean} payload.isActive
   */
  async updateBank(id, payload) {
    try {
      const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating bank:', error);
      throw error;
    }
  },

  /**
   * Delete bank by id
   * @param {number|string} id
   */
  async deleteBank(id) {
    try {
      const response = await userRequest.delete(`${API_BASE}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error deleting bank:', error);
      throw error;
    }
  },
};

export default bankService;
