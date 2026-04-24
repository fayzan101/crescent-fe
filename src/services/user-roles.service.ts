import { userRequest } from "@/lib/RequestMethods";

const API_BASE = "/api/v1/user-roles";

export interface CreateRolePayload {
  roleName: string;
  description: string;
  isActive: boolean;
}

const userRolesService = {
  /**
   * Delete a user role by id
   * @param {number|string} id
   */
  async deleteRole(id: number | string) {
    try {
      const response = await userRequest.delete(`${API_BASE}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
  },
  /**
   * Update a user role by id
   * @param {number|string} id
   * @param {CreateRolePayload} payload
   */
  async updateRole(id: number | string, payload: CreateRolePayload) {
    try {
      const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  },
  /**
   * Get a user role by id
   * @param {number|string} id
   */
  async getRoleById(id: number | string) {
    try {
      const response = await userRequest.get(`${API_BASE}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error fetching role by id:", error);
      throw error;
    }
  },
  /**
   * Create a new user role
   * @param {CreateRolePayload} payload
   */
  async createRole(payload: CreateRolePayload) {
    try {
      const response = await userRequest.post(API_BASE, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  },

  /**
   * Fetch all user roles
   */
  async fetchRoles() {
    try {
      const response = await userRequest.get(API_BASE);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },
};

export default userRolesService;
