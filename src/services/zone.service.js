import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/zones';

const zoneService = {
	/**
	 * Create a new zone
	 * @param {object} payload
	 * @param {number|string} payload.officeId
	 * @param {string} payload.zoneName
	 * @param {boolean} payload.isActive
	 */
	async createZone(payload) {
		try {
			const response = await userRequest.post(API_BASE, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error creating zone:', error);
			throw error;
		}
	},

	/**
	 * Fetch zones (optional filter by officeId)
	 * @param {object} params
	 * @param {number|string} [params.officeId]
	 */
	async fetchZones(params) {
		try {
			const response = await userRequest.get(API_BASE, { params });
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching zones:', error);
			throw error;
		}
	},

	/**
	 * Get zone by id
	 * @param {number|string} id
	 */
	async getZoneById(id) {
		try {
			const response = await userRequest.get(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching zone by id:', error);
			throw error;
		}
	},

	/**
	 * Update zone by id
	 * @param {number|string} id
	 * @param {object} payload
	 * @param {string} payload.zoneName
	 * @param {boolean} payload.isActive
	 */
	async updateZone(id, payload) {
		try {
			const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error updating zone:', error);
			throw error;
		}
	},

	/**
	 * Delete zone by id
	 * @param {number|string} id
	 */
	async deleteZone(id) {
		try {
			const response = await userRequest.delete(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error deleting zone:', error);
			throw error;
		}
	},
};

export default zoneService;
