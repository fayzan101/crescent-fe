import { userRequest } from "@/lib/RequestMethods";

// Fetch inventory purchase requests
export const getPurchaseRequests = async () => {
  try {
    const response = await userRequest.get("/api/v1/overview/purchase-requests");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch all purchase requests
export const getAllPurchaseRequests = async () => {
  try {
    const response = await userRequest.get("/api/v1/purchase-requests");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a purchase request
export const createPurchaseRequest = async (data) => {
  if (!data) throw new Error("Purchase request data is required");
  try {
    const response = await userRequest.post("/api/v1/purchase-requests", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single purchase request by ID
export const getPurchaseRequestById = async (id) => {
  if (!id) throw new Error("Purchase request ID is required");
  try {
    const response = await userRequest.get(`/api/v1/purchase-requests/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a purchase request by ID
export const updatePurchaseRequest = async (id, data) => {
  if (!id) throw new Error("Purchase request ID is required");
  if (!data) throw new Error("Update data is required");
  try {
    const response = await userRequest.put(`/api/v1/purchase-requests/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a purchase request by ID
export const deletePurchaseRequest = async (id) => {
  if (!id) throw new Error("Purchase request ID is required");
  try {
    const response = await userRequest.delete(`/api/v1/purchase-requests/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Approve a purchase request by ID
export const approvePurchaseRequest = async (id) => {
  if (!id) throw new Error("Purchase request ID is required");
  try {
    const response = await userRequest.post(`/api/v1/purchase-requests/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reject a purchase request by ID
export const rejectPurchaseRequest = async (id, reason) => {
  if (!id) throw new Error("Purchase request ID is required");
  if (!reason) throw new Error("Rejection reason is required");
  try {
    const response = await userRequest.post(`/api/v1/purchase-requests/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};
