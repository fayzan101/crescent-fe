import { userRequest } from '@/lib/RequestMethods';

const API_BASE = '/api/v1/products';

const productService = {
  /**
   * Create a new product
   * @param {object} payload
   * @param {string} payload.productName
   * @param {boolean} payload.isActive
   */
  async createProduct(payload) {
    try {
      const response = await userRequest.post(API_BASE, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * Fetch products
   * @param {object} params
   */
  async fetchProducts(params) {
    try {
      const response = await userRequest.get(API_BASE, { params });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get product by id
   * @param {number|string} id
   */
  async getProductById(id) {
    try {
      const response = await userRequest.get(`${API_BASE}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching product by id:', error);
      throw error;
    }
  },

  /**
   * Update product by id
   * @param {number|string} id
   * @param {object} payload
   * @param {string} payload.productName
   * @param {boolean} payload.isActive
   */
  async updateProduct(id, payload) {
    try {
      const response = await userRequest.patch(`${API_BASE}/${id}`, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  /**
   * Delete product by id
   * @param {number|string} id
   */
  async deleteProduct(id) {
    try {
      const response = await userRequest.delete(`${API_BASE}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

export default productService;
