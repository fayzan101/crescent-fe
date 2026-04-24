import { userRequest } from "@/lib/RequestMethods";

// Bulk issuance API
export const bulkIssuance = async (data: any) => {
  if (!data) throw new Error("Issuance data is required");
  try {
    const response = await userRequest.post("/api/v1/bulk/issuance", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Bulk create items API
export const bulkCreateItems = async (data: any) => {
  if (!data) throw new Error("Bulk items data is required");
  try {
    const response = await userRequest.post("/api/v1/bulk/items", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    const response = await userRequest.get("/api/v1/dashboard/stats");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get low stock items
export const getLowStockItems = async () => {
  try {
    const response = await userRequest.get("/api/v1/low-stock-items");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get out of stock items
export const getOutOfStockItems = async () => {
  try {
    const response = await userRequest.get("/api/v1/out-of-stock-items");
    return response.data;
  } catch (error) {
    throw error;
  }
};
