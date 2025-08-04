import BaseApiService from "./baseApiService.js";

export class CostCenterService extends BaseApiService {
  async getCostCenterAll() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
  }

  async getCostCenterById(id) {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}/${id}`);
  }

  async storeCostCenter(data) {
    return await this.httpClient.post(
      `${this.microservice}/${this.endpoint}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  async updateCostCenter(id, data) {
    return await this.httpClient.put(
      `${this.microservice}/${this.endpoint}/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  async deleteCostCenter(id) {
    return await this.httpClient.delete(`${this.microservice}/${this.endpoint}/${id}`);
  }

  // Métodos adicionales específicos para centros de costo
  async getActiveCostCenters() {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/active`
    );
  }

  async getCostCentersByDepartment(departmentId) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/department/${departmentId}`
    );
  }

  async getCostCentersByStatus(status) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/status/${status}`
    );
  }
}

export default CostCenterService;