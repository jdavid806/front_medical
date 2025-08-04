import BaseApiService from "./baseApiService.js";

export class FarmaciaService extends BaseApiService {
  async getAllRecipes() {
    return await this.httpClient.get(`${this.microservice}/recipes`);
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
}

export default FarmaciaService;
