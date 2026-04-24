import { userRequest } from "@/lib/RequestMethods";

// Get dropdown categories
export const getDropdownCategories = async () => {
  try {
    const response = await userRequest.get("/api/v1/dropdown/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get dropdown items
export const getDropdownItems = async () => {
  try {
    const response = await userRequest.get("/api/v1/dropdown/items");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get dropdown stores
export const getDropdownStores = async () => {
  try {
    const response = await userRequest.get("/api/v1/dropdown/stores");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get dropdown vendors
export const getDropdownVendors = async () => {
  try {
    const response = await userRequest.get("/api/v1/dropdown/vendors");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get dropdowns by resources
export const getDropdowns = async (resources) => {
  try {
    const response = await userRequest.get("/api/v1/dropdowns", { params: { resources } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search guards by service number
export const searchGuards = async (service_no) => {
  try {
    const response = await userRequest.get("/api/v1/guards/search", { params: { service_no } });
    return response.data;
  } catch (error) {
    throw error;
  }
};
