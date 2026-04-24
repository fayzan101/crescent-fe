import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/offices';

const officeService = {
	/**
	 * Create a new office
	 * @param {object} payload
	 * @param {string} payload.officeName
	 * @param {boolean} payload.isActive
	 */
	async createOffice(payload) {
		try {
			const response = await userRequest.post(API_BASE, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error creating office:', error);
			throw error;
		}
	},

	/**
	 * Fetch offices for the current organization
	 * @param {object} params
	 */
	async fetchOfficesByOrganization(params) {
		try {
			const response = await userRequest.get(API_BASE, { params });
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching offices:', error);
			throw error;
		}
	},

	/**
	 * Get office by id
	 * @param {number|string} id
	 */
	async getOfficeById(id) {
		try {
			const response = await userRequest.get(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching office by id:', error);
			throw error;
		}
	},

	/**
	 * Update office by id
	 * @param {number|string} id
	 * @param {object} payload
	 * @param {string} payload.officeName
	 * @param {boolean} payload.isActive
	 */
	async updateOffice(id, payload) {
		try {
			const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error updating office:', error);
			throw error;
		}
	},

	/**
	 * Delete office by id
	 * @param {number|string} id
	 */
	async deleteOffice(id) {
		try {
			const response = await userRequest.delete(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error deleting office:', error);
			throw error;
		}
	},
};

export default officeService;
