import BaseApiService from "./baseApiService.js";

export class EntitiesService extends BaseApiService {
  async getEntities() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
  }
}

export default EntitiesService;
