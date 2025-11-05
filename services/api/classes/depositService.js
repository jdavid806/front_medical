import BaseApiService from "./baseApiService.js";

export class DepositService extends BaseApiService {
  async getAllDeposits() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
  }

  async getDepositById(id) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/${id}`
    );
  }

  async createDeposit(depositData) {
    return await this.httpClient.post(
      `${this.microservice}/${this.endpoint}`,
      depositData
    );
  }

  async updateDeposit(id, depositData) {
    return await this.httpClient.put(
      `${this.microservice}/${this.endpoint}/${id}`,
      depositData
    );
  }

  async deleteDeposit(id) {
    return await this.httpClient.delete(
      `${this.microservice}/${this.endpoint}/${id}`
    );
  }

  async getPOSBoxDeposit() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}/first/pos-box-deposit`);
  }
}

export default DepositService;