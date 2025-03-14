import BaseApiService from "./baseApiService.js";

export class PackagesService extends BaseApiService {
  async getAllPackages() {
    return await this.httpClient.get(`${this.microservice}/packages`);
  }

  async getPackagesByExams() {
    return await this.httpClient.get(`${this.microservice}/packages/examenes`);
  }

  async getPackagesByMedications() {
    return await this.httpClient.get(`${this.microservice}/packages/medicina`);
  }

  async getPackagesByVaccines() {
    return await this.httpClient.get(`${this.microservice}/packages/vacunas`);
  }

  async getPackagesBySupplies() {
    return await this.httpClient.get(`${this.microservice}/packages/insumos`);
  }
}

export default PackagesService;
