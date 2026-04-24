export async function deletePermission(id) {
	try {
		const response = await axios.delete(`${PERMISSIONS_API_URL}/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
}
export async function updatePermission(id, permission) {
	try {
		const response = await axios.patch(`${PERMISSIONS_API_URL}/${id}`, permission, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
}
export async function getPermissionById(id) {
	try {
		const response = await axios.get(`${PERMISSIONS_API_URL}/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
}
export async function getPermissions() {
	try {
		const response = await axios.get(PERMISSIONS_API_URL);
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
}
import axios from 'axios';

const PERMISSIONS_API_URL = '/api/v1/permissions';

export async function createPermission(permission) {
	try {
		const response = await axios.post(PERMISSIONS_API_URL, permission, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
}
