import BaseApiService from "./baseApiService.js";

export class AccountingVouchersService extends BaseApiService {
  async getAccountingVouchers(paramsPaginator) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}?withDetails=true&page=${paramsPaginator.page}&perPage=${paramsPaginator.per_page}`
    );
  }

  async getLastRow() {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/last-row`
    );
  }

  async storeAccountingVouchers(data) {
    return await this.httpClient.post(
      `${this.microservice}/${this.endpoint}`,
      data
    );
  }

  async updateAccountingVouchers(id, data) {
    return await this.httpClient.put(
      `${this.microservice}/${this.endpoint}/${id}`,
      data
    );
  }

  async delete(id) {
    return await this.httpClient.delete(
      `${this.microservice}/${this.endpoint}/${id}/mark-delete`
    );
  }
}

export default AccountingVouchersService;
