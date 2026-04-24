import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/employees';

export interface CreateEmployeePayload {
	emailId: string;
	primaryMobileNo: string;
	cnic: string;
	designation: string;
	nextOfKin: string;
	nextOfKinContact: string;
	isActive: boolean;
}

const employeeService = {
	/**
	 * Create a new employee
	 */
	async createEmployee(payload: CreateEmployeePayload) {
		try {
			const response = await userRequest.post(API_BASE, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error creating employee:', error);
			throw error;
		}
	},

	/**
	 * Fetch employees
	 */
	async fetchEmployees() {
		try {
			const response = await userRequest.get(API_BASE);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching employees:', error);
			throw error;
		}
	},

	/**
	 * Get employee by id
	 */
	async getEmployeeById(id: number | string) {
		try {
			const response = await userRequest.get(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error fetching employee by id:', error);
			throw error;
		}
	},

	/**
	 * Update employee by id
	 */
	async updateEmployee(id: number | string, payload: CreateEmployeePayload) {
		try {
			const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error updating employee:', error);
			throw error;
		}
	},

	/**
	 * Delete employee by id
	 */
	async deleteEmployee(id: number | string) {
		try {
			const response = await userRequest.delete(`${API_BASE}/${id}`);
			return response.data?.data || response.data;
		} catch (error) {
			console.error('Error deleting employee:', error);
			throw error;
		}
	},
};

export default employeeService;
