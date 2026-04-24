import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/vendors';

export interface CreateVendorPayload {
	vendorName: string;
	cityId: number | string;
	address: string;
	emailId: string;
	contactPerson: string;
	primaryMobile: string;
	secondaryMobile: string;
	isActive: boolean;
}

const vendorService = {
	/**
	 * Create a new vendor
	 */
	async createVendor(payload: CreateVendorPayload) {
		try {
			const response = await userRequest.post(API_BASE, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error creating vendor:', error);
			throw error;
		}
	},

	/**
	 * Fetch vendors (optional filter by cityId)
	 */
	async fetchVendors(params?: { cityId?: number | string }) {
		try {
			const response = await userRequest.get(API_BASE, { params });
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching vendors:', error);
			throw error;
		}
	},

	/**
	 * Get vendor by id
	 */
	async getVendorById(id: number | string) {
		try {
			const response = await userRequest.get(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching vendor by id:', error);
			throw error;
		}
	},

	/**
	 * Update vendor by id
	 */
	async updateVendor(id: number | string, payload: CreateVendorPayload) {
		try {
			const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error updating vendor:', error);
			throw error;
		}
	},

	/**
	 * Delete vendor by id
	 */
	async deleteVendor(id: number | string) {
		try {
			const response = await userRequest.delete(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error deleting vendor:', error);
			throw error;
		}
	},
};

export default vendorService;
