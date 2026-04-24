import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/app-users';

const usersService = {
	/**
	 * Fetch application users
	 */
	async fetchAppUsers() {
		try {
			const response = await userRequest.get(API_BASE);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching application users:', error);
			throw error;
		}
	},

	/**
	 * Get application user by id
	 * @param {number|string} id
	 */
	async getAppUserById(id) {
		try {
			const response = await userRequest.get(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching application user by id:', error);
			throw error;
		}
	},

	/**
	 * Update application user by id
	 * @param {number|string} id
	 * @param {object} payload
	 * @param {string} payload.email
	 * @param {string} payload.password
	 * @param {string} payload.dob
	 * @param {string} payload.cnic
	 * @param {string} payload.contactNo
	 * @param {string} payload.address
	 */
	async updateAppUser(id, payload) {
		try {
			const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error updating application user:', error);
			throw error;
		}
	 },

	/**
	 * Delete application user by id
	 * @param {number|string} id
	 */
	async deleteAppUser(id) {
		try {
			const response = await userRequest.delete(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error deleting application user:', error);
			throw error;
		}
	},
};

export default usersService;
