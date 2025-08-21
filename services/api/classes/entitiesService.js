import BaseApiService from "./baseApiService.js";

export class EntitiesService extends BaseApiService {
  async getEntities() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
  }

  async getEntityById(id) {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}/${id}`);
  }

  async storeEntity(data) {
    return await this.httpClient.post(`${this.microservice}/${this.endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async updateEntity(id, data) {
    return await this.httpClient.put(`${this.microservice}/${this.endpoint}/${id}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async deleteEntity(id) {
    return await this.httpClient.delete(`${this.microservice}/${this.endpoint}/${id}`);
  }
}

export default EntitiesService;