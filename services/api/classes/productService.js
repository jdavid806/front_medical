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
      `api/v1/admin/products/${productId}`
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
      "api/v1/admin/product-create-entities",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async updateProductEntity(id, data) {
    return await this.httpClient.put(
      `api/v1/admin/product-update-entities/${id}`,
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

  async deleteProductById(productId) {
    return await this.httpClient.delete(
      `api/v1/admin/products/${productId}`
    );
  }

  async getProductsServicesActiveFixed() {
    return await this.httpClient.get('api/v1/admin/products/activos-fijos');
  }
}

export default ProductService;
