import BaseApiService from "./baseApiService.js";

export class ProductService extends BaseApiService {
  async getAllProducts() {
    return await this.httpClient.get(`${this.microservice}/products-all`);
  }


  async getProductsServices() {
    return await this.httpClient.get('api/v1/admin/products/servicios');
  }

  async getProductById(productId) {
    return await this.httpClient.get(
      `${this.microservice}/product/${productId}`
    );
  }

  async getProductsByIds(productIds) {
    return await this.httpClient.post(
      `api/v1/admin/products/all/by-ids`,
      {
        ids: productIds
      }
    );
  }

  async getService() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
  }

  async storeProductEntity(data) {
    return await this.httpClient.post(
      this.microservice + "/" + "product-create-entities",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async storeProduct(data) {
    return await this.httpClient.post(
      this.microservice + "/" + "product-create",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async updateProduct(id, data) {
    return await this.httpClient.put(
      `api/v1/admin/products/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async getProductTypes() {
    return await this.httpClient.get(`${this.microservice}/products-types`);
  }

  async getProductsByExamRecipe(id) {
    return await this.httpClient.get(
      `${this.microservice}/products-by-exam-recipe/${id}`
    );
  }

  async deleteProduct(productId) {
    return await this.httpClient.delete(
      this.microservice + "/" + "products" + "/" + productId
    );
  }
}

export default ProductService;
