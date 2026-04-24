import { userRequest } from "@/lib/RequestMethods";

// Bulk issuance
export const bulkIssuance = async (data) => {
  if (!data) throw new Error("Issuance data is required");
  try {
    const response = await userRequest.post("/api/v1/bulk/issuance", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all issuances
export const getIssuances = async () => {
  try {
    const response = await userRequest.get("/api/v1/issuance");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new issuance
export const createIssuance = async (data) => {
  if (!data) throw new Error("Issuance data is required");
  try {
    const response = await userRequest.post("/api/v1/issuance", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get issuance by ID
export const getIssuanceById = async (id) => {
  if (!id) throw new Error("Issuance ID is required");
  try {
    const response = await userRequest.get(`/api/v1/issuance/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update issuance by ID
export const updateIssuance = async (id, data) => {
  if (!id) throw new Error("Issuance ID is required");
  if (!data) throw new Error("Issuance data is required");
  try {
    const response = await userRequest.put(`/api/v1/issuance/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete issuance by ID
export const deleteIssuance = async (id) => {
  if (!id) throw new Error("Issuance ID is required");
  try {
    const response = await userRequest.delete(`/api/v1/issuance/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all returns
export const getReturns = async () => {
  try {
    const response = await userRequest.get("/api/v1/returns");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new return
export const createReturn = async (data) => {
  if (!data) throw new Error("Return data is required");
  try {
    const response = await userRequest.post("/api/v1/returns", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get return by ID
export const getReturnById = async (id) => {
  if (!id) throw new Error("Return ID is required");
  try {
    const response = await userRequest.get(`/api/v1/returns/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update return by ID
export const updateReturn = async (id, data) => {
  if (!id) throw new Error("Return ID is required");
  if (!data) throw new Error("Return data is required");
  try {
    const response = await userRequest.put(`/api/v1/returns/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete return by ID
export const deleteReturn = async (id) => {
  if (!id) throw new Error("Return ID is required");
  try {
    const response = await userRequest.delete(`/api/v1/returns/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all transfers
export const getTransfers = async () => {
  try {
    const response = await userRequest.get("/api/v1/transfers");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new transfer
export const createTransfer = async (data) => {
  if (!data) throw new Error("Transfer data is required");
  try {
    const response = await userRequest.post("/api/v1/transfers", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get transfer by ID
export const getTransferById = async (id) => {
  if (!id) throw new Error("Transfer ID is required");
  try {
    const response = await userRequest.get(`/api/v1/transfers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update transfer by ID
export const updateTransfer = async (id, data) => {
  if (!id) throw new Error("Transfer ID is required");
  if (!data) throw new Error("Transfer data is required");
  try {
    const response = await userRequest.put(`/api/v1/transfers/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete transfer by ID
export const deleteTransfer = async (id) => {
  if (!id) throw new Error("Transfer ID is required");
  try {
    const response = await userRequest.delete(`/api/v1/transfers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
