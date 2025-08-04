import BaseApiService from "./baseApiService.js";

export class ResourcesAdminService extends BaseApiService {
  static getAssetCategories() {
    throw new Error("Method not implemented.");
  }
  async getThirdParties() {
    return await this.httpClient.get(`${this.microservice}/third-parties`);
  }

  async getAssetCategories() {
    return await this.httpClient.get(`${this.microservice}/asset-categories`);
  }

  async getAdvancePayments(thirdPartyId, type) {
    return await this.httpClient.get(
      `${this.microservice}/third-party/${thirdPartyId}/advance/${type}`
    );
  }
}

export default ResourcesAdminService;
