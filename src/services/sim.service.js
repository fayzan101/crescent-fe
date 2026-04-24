export async function deleteSim(id) {
	try {
		const response = await axios.delete(`${SIMS_API_URL}/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
}
export async function updateSim(id, sim) {
	try {
		const response = await axios.patch(`${SIMS_API_URL}/${id}`, sim, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
}
export async function getSimById(id) {
	try {
		const response = await userRequest.get(`${SIMS_API_URL}/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
}
export async function getSims() {
	try {
		const response = await userRequest.get(SIMS_API_URL);
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
}
import axios from 'axios';
import { userRequest } from '@/lib/RequestMethods';

const SIMS_API_URL = '/api/v1/sims';

export async function createSim(sim) {
	try {
		const response = await axios.post(SIMS_API_URL, sim, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || error;
	}
}
