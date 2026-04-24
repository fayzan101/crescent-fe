import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/client-categories';

const clientCategoryService = {
	/**
	 * Create a new client category
	 * @param {object} payload
	 * @param {string} payload.categoryName
	 * @param {boolean} payload.isActive
	 */
	async createClientCategory(payload) {
		try {
			const response = await userRequest.post(API_BASE, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error creating client category:', error);
			throw error;
		}
	},

	/**
	 * Fetch client categories
	 * @param {object} params
	 */
	async fetchClientCategories(params) {
		try {
			const response = await userRequest.get(API_BASE, { params });
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching client categories:', error);
			throw error;
		}
	},

	/**
	 * Get client category by id
	 * @param {number|string} id
	 */
	async getClientCategoryById(id) {
		try {
			const response = await userRequest.get(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching client category by id:', error);
			throw error;
		}
	},

	/**
	 * Update client category by id
	 * @param {number|string} id
	 * @param {object} payload
	 * @param {string} payload.categoryName
	 * @param {boolean} payload.isActive
	 */
	async updateClientCategory(id, payload) {
		try {
			const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error updating client category:', error);
			throw error;
		}
	},

	/**
	 * Delete client category by id
	 * @param {number|string} id
	 */
	async deleteClientCategory(id) {
		try {
			const response = await userRequest.delete(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error deleting client category:', error);
			throw error;
		}
	},
};

export default clientCategoryService;
