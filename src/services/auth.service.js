import { publicRequest } from '@/lib/RequestMethods';
const API_BASE = '/api/v1/auth';
const authService = {
	/**
	 * Register a new user and return access/refresh tokens
	 * @param {object} payload - Registration payload
	 * @param {string} payload.email
	 * @param {string} payload.password
	 * @param {string} payload.dob
	 * @param {string} payload.cnic
	 * @param {string} payload.contactNo
	 * @param {string} payload.address
	 * @returns {Promise} Registration response
	 */
	async register(payload) {
		try {
			const response = await publicRequest.post(`${API_BASE}/register`, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error registering user:', error);
			throw error;
		}
	},

	/**
	 * Login with email/password and receive JWT access token
	 * @param {object} payload - Login payload
	 * @param {string} payload.email
	 * @param {string} payload.password
	 * @returns {Promise} Login response
	 */
	async login(payload) {
		try {
			const response = await publicRequest.post(`${API_BASE}/login`, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error logging in:', error);
			throw error;
		}
	},

	/**
	 * Refresh access token (rotates refresh token)
	 * @param {object} payload - Refresh payload
	 * @param {string} payload.refreshToken
	 * @returns {Promise} Refresh response
	 */
	async refresh(payload) {
		try {
			const response = await publicRequest.post(`${API_BASE}/refresh`, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error refreshing token:', error);
			throw error;
		}
	},

	/**
	 * Revoke refresh token (logout)
	 * @param {object} payload - Logout payload
	 * @param {string} payload.refreshToken
	 * @returns {Promise} Logout response
	 */
	async logout(payload) {
		try {
			const response = await publicRequest.post(`${API_BASE}/logout`, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error logging out:', error);
			throw error;
		}
	},
};

export default authService;
