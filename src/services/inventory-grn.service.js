import { userRequest } from "@/lib/RequestMethods";

// Get all GRNs (Goods Receiving Notes)
export const getAllGRNs = async () => {
  try {
    const response = await userRequest.get("/api/v1/grn");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new GRN (Goods Receiving Note)
export const createGRN = async (data) => {
  if (!data) throw new Error("GRN data is required");
  try {
    const response = await userRequest.post("/api/v1/grn", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a GRN by ID
export const getGRNById = async (id) => {
  if (!id) throw new Error("GRN ID is required");
  try {
    const response = await userRequest.get(`/api/v1/grn/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a GRN by ID
export const updateGRN = async (id, data) => {
  if (!id) throw new Error("GRN ID is required");
  if (!data) throw new Error("GRN data is required");
  try {
    const response = await userRequest.put(`/api/v1/grn/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a GRN by ID
export const deleteGRN = async (id) => {
  if (!id) throw new Error("GRN ID is required");
  try {
    const response = await userRequest.delete(`/api/v1/grn/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Confirm a GRN by ID
export const confirmGRN = async (id) => {
  if (!id) throw new Error("GRN ID is required");
  try {
    const response = await userRequest.post(`/api/v1/grn/${id}/confirm`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get GRN by Purchase Order ID
export const getGRNByPurchaseOrderId = async (poId) => {
  if (!poId) throw new Error("Purchase Order ID is required");
  try {
    const response = await userRequest.get(`/api/v1/grn/purchase-order/${poId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
