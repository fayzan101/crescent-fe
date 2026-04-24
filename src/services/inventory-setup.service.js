import { userRequest } from "@/lib/RequestMethods";

// Fetch inventory categories
export const getInventoryCategories = async () => {
  try {
    const response = await userRequest.get("/api/v1/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single inventory category by ID
export const getInventoryCategoryById = async (id) => {
  if (!id) throw new Error("Category ID is required");
  try {
    const response = await userRequest.get(`/api/v1/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an inventory category by ID
export const updateInventoryCategory = async (id, data) => {
  if (!id) throw new Error("Category ID is required");
  if (!data) throw new Error("Update data is required");
  try {
    const response = await userRequest.put(`/api/v1/categories/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an inventory category by ID
export const deleteInventoryCategory = async (id) => {
  if (!id) throw new Error("Category ID is required");
  try {
    const response = await userRequest.delete(`/api/v1/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch inventory groups
export const getInventoryGroups = async () => {
  try {
    const response = await userRequest.get("/api/v1/groups");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new inventory group
export const createInventoryGroup = async (data) => {
  if (!data) throw new Error("Group data is required");
  try {
    const response = await userRequest.post("/api/v1/groups", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new inventory category
export const createInventoryCategory = async (data) => {
  if (!data) throw new Error("Category data is required");
  try {
    const response = await userRequest.post("/api/v1/categories", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single inventory group by ID
export const getInventoryGroupById = async (id) => {
  if (!id) throw new Error("Group ID is required");
  try {
    const response = await userRequest.get(`/api/v1/groups/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an inventory group by ID
export const updateInventoryGroup = async (id, data) => {
  if (!id) throw new Error("Group ID is required");
  if (!data) throw new Error("Update data is required");
  try {
    const response = await userRequest.put(`/api/v1/groups/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an inventory group by ID
export const deleteInventoryGroup = async (id) => {
  if (!id) throw new Error("Group ID is required");
  try {
    const response = await userRequest.delete(`/api/v1/groups/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch inventory vendors
export const getInventoryVendors = async () => {
  try {
    const response = await userRequest.get("/api/v1/inventory-vendors");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new inventory vendor
export const createInventoryVendor = async (data) => {
  if (!data) throw new Error("Vendor data is required");
  try {
    const response = await userRequest.post("/api/v1/inventory-vendors", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single inventory vendor by ID
export const getInventoryVendorById = async (id) => {
  if (!id) throw new Error("Vendor ID is required");
  try {
    const response = await userRequest.get(`/api/v1/inventory-vendors/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an inventory vendor by ID
export const updateInventoryVendor = async (id, data) => {
  if (!id) throw new Error("Vendor ID is required");
  if (!data) throw new Error("Update data is required");
  try {
    const response = await userRequest.put(`/api/v1/inventory-vendors/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an inventory vendor by ID
export const deleteInventoryVendor = async (id) => {
  if (!id) throw new Error("Vendor ID is required");
  try {
    const response = await userRequest.delete(`/api/v1/inventory-vendors/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch stores
export const getStores = async () => {
  try {
    const response = await userRequest.get("/api/v1/stores");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new store
export const createStore = async (data) => {
  if (!data) throw new Error("Store data is required");
  try {
    const response = await userRequest.post("/api/v1/stores", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single store by ID
export const getStoreById = async (id) => {
  if (!id) throw new Error("Store ID is required");
  try {
    const response = await userRequest.get(`/api/v1/stores/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a store by ID
export const updateStore = async (id, data) => {
  if (!id) throw new Error("Store ID is required");
  if (!data) throw new Error("Update data is required");
  try {
    const response = await userRequest.put(`/api/v1/stores/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a store by ID
export const deleteStore = async (id) => {
  if (!id) throw new Error("Store ID is required");
  try {
    const response = await userRequest.delete(`/api/v1/stores/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
