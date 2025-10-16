import BaseApiService from "./baseApiService.js";

export class FarmaciaService extends BaseApiService {
  async getAllRecipes(status = "ALL", search = "") {
    return await this.httpClient.get(`${this.microservice}/recipes?status=${status}&search=${search}`);
  }
  async getAllprescriptions() {
    return await this.httpClient.get(`${this.microservice}/prescriptions`);
  }
  async getRecipesById(id) {
    return await this.httpClient.get(`${this.microservice}/recipes/${id}`);
  }
  async getPrescriptionsByid(id) {
    return await this.httpClient.get(
      `${this.microservice}/prescriptions/${id}`
    );
  }
  async getAllVacunas() {
    return await this.httpClient.get(`api/v1/admin/products/vacunas`);
  }

  async validateMedicine(id) {
    return await this.httpClient.get(`${this.microservice}/medicines/${id}`);
  }

  async verifyProductsBulk(products) {
    return await this.httpClient.post(`api/v1/admin/products/check/verify-product-bulk`, products);
  }

  async getProductsWithAvailableStock(productTypeNames, inventoryType) {
    return await this.httpClient.get(`api/v1/admin/products/with/available-stock/${productTypeNames}/${inventoryType}`);
  }
}

export default FarmaciaService;
