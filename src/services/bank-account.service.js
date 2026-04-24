import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/bank-accounts';

const bankAccountService = {
  /**
   * Create a new bank account
   * @param {object} payload
   * @param {number} payload.bankId
   * @param {string} payload.accountNo
   * @param {string} payload.iban
   * @param {string} payload.branchCode
   * @param {string} payload.branch
   * @param {boolean} payload.isActive
   */
  async createBankAccount(payload) {
    try {
      const response = await userRequest.post(API_BASE, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating bank account:', error);
      throw error;
    }
  },

  /**
   * Fetch bank accounts (optional filter by bankId)
   * @param {object} params
   * @param {number} params.bankId
   */
  async fetchBankAccounts(params) {
    try {
      const response = await userRequest.get(API_BASE, { params });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      throw error;
    }
  },

  /**
   * Get bank account by id
   * @param {number|string} id
   */
  async getBankAccountById(id) {
    try {
      const response = await userRequest.get(`${API_BASE}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching bank account by id:', error);
      throw error;
    }
  },

  /**
   * Update bank account by id
   * @param {number|string} id
   * @param {object} payload
   * @param {string} payload.accountNo
   * @param {string} payload.iban
   * @param {string} payload.branchCode
   * @param {string} payload.branch
   * @param {boolean} payload.isActive
   */
  async updateBankAccount(id, payload) {
    try {
      const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating bank account:', error);
      throw error;
    }
  },

  /**
   * Delete bank account by id
   * @param {number|string} id
   */
  async deleteBankAccount(id) {
    try {
      const response = await userRequest.delete(`${API_BASE}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error deleting bank account:', error);
      throw error;
    }
  },
};

export default bankAccountService;
