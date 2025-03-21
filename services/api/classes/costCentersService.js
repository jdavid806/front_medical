import BaseApiService from "./baseApiService.js";

export class CostCenterService extends BaseApiService {
  async getCostCenterAll() {
    return await this.httpClient.get(`api/v1/admin/centres-cost`);
  }
}

export default CostCenterService;
