import BaseApiService from "./baseApiService.js";

export class PackagesService extends BaseApiService {
  async createPackages(data) {
    return await this.httpClient.post(
      `${this.microservice}/packages/items`,
      data
    );
  }

  async getPackageByCie11(cie11) {
    return await this.httpClient.get(
      `${this.microservice}/packages/cie11/${cie11}`
    );
  }

  async getPackageByCup(cup) {
    return await this.httpClient.get(
      `${this.microservice}/packages/cups/${cup}`
    );
  }

  async getAllPackages() {
    return await this.httpClient.get(`${this.microservice}/packages`);
  }

  async getPackagesByExams() {
    return await this.httpClient.get(`${this.microservice}/packages/examenes`);
  }

  async getPackagesByMedications() {
    return await this.httpClient.get(
      `${this.microservice}/products/medicamentos`
    );
  }

  async getPackagesByVaccines() {
    return await this.httpClient.get(`${this.microservice}/products/vacunas`);
  }

  async getPackagesBySupplies() {
    return await this.httpClient.get(`${this.microservice}/products/insumos`);
  }
}

export default PackagesService;
