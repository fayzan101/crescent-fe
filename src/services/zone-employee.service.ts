import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/zone-employees';

export interface AssignZoneEmployeePayload {
	zoneId: number;
	employeeId: number;
}
/**
 * Optional filters for fetching zone-employee assignments
 */
export interface FetchZoneEmployeeAssignmentsParams {
	zoneId?: number;
	employeeId?: number;
}

const zoneEmployeeService = {
			/**
			 * Remove a zone-employee assignment by id
			 * @param {number} id
			 * @returns {Promise<any>} API response
			 */
			async deleteZoneEmployeeAssignment(id: number) {
				try {
					const response = await userRequest.delete(`${API_BASE}/${id}`);
					return response.data?.data || response.data;
				} catch (error) {
					console.error('Error deleting zone-employee assignment:', error);
					throw error;
				}
			},
		/**
		 * Update a zone-employee assignment by id
		 * @param {number} id
		 * @param {{ zoneId: number, employeeId: number }} payload
		 * @returns {Promise<any>} API response
		 */
		async updateZoneEmployeeAssignment(id: number, payload: { zoneId: number; employeeId: number }) {
			try {
				const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
				return response.data?.data || response.data;
			} catch (error) {
				console.error('Error updating zone-employee assignment:', error);
				throw error;
			}
		},
	/**
	 * Assign an employee to a zone
	 * @param {AssignZoneEmployeePayload} payload
	 * @returns {Promise<any>} API response
	 */
	async assignEmployeeToZone(payload: AssignZoneEmployeePayload) {
		try {
			const response = await userRequest.post(API_BASE, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error assigning employee to zone:', error);
			throw error;
		}
	},

	/**
	 * Get a zone-employee assignment by id
	 * @param {number} id
	 * @returns {Promise<any>} API response
	 */
	async fetchZoneEmployeeAssignmentById(id: number) {
		try {
			const response = await userRequest.get(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching zone-employee assignment by id:', error);
			throw error;
		}
	},

	/**
	 * List zone-employee assignments (with optional filters)
	 * @param {FetchZoneEmployeeAssignmentsParams} params
	 * @returns {Promise<any>} API response
	 */
	async fetchZoneEmployeeAssignments(params?: FetchZoneEmployeeAssignmentsParams) {
		try {
			const response = await userRequest.get(API_BASE, { params });
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching zone-employee assignments:', error);
			throw error;
		}
	},
};

export default zoneEmployeeService;
