import { userRequest } from "@/lib/RequestMethods";

// Fetch inventory items
export const getInventoryItems = async () => {
  try {
    const response = await userRequest.get("/api/v1/items");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new inventory item
export const createInventoryItem = async (data) => {
  if (!data) throw new Error("Item data is required");
  try {
    const response = await userRequest.post("/api/v1/items", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single inventory item by ID
export const getInventoryItemById = async (id) => {
  if (!id) throw new Error("Item ID is required");
  try {
    const response = await userRequest.get(`/api/v1/items/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an inventory item by ID
export const updateInventoryItem = async (id, data) => {
  if (!id) throw new Error("Item ID is required");
  if (!data) throw new Error("Update data is required");
  try {
    const response = await userRequest.put(`/api/v1/items/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an inventory item by ID
export const deleteInventoryItem = async (id) => {
  if (!id) throw new Error("Item ID is required");
  try {
    const response = await userRequest.delete(`/api/v1/items/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search inventory items
export const searchInventoryItems = async (q) => {
  if (!q) throw new Error("Search query is required");
  try {
    const response = await userRequest.get(`/api/v1/items/search`, { params: { q } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single inventory item by SKU
export const getInventoryItemBySku = async (sku) => {
  if (!sku) throw new Error("SKU is required");
  try {
    const response = await userRequest.get(`/api/v1/items/sku/${sku}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch overview items
export const getOverviewItems = async () => {
  try {
    const response = await userRequest.get("/api/v1/overview/items");
    return response.data;
  } catch (error) {
    throw error;
  }
};
