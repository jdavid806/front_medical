import BaseApiService from "./baseApiService";

export class RetentionsService extends BaseApiService {
  async getRetentions() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
  }

  async getRetentionById(id) {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}/${id}`);
  }

async storeRetention(data) {
    return await this.httpClient.post(
        this.microservice + "/" + this.endpoint,
        data,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}

  async updateRetention(id, data) {
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

  async deleteRetention(id) {
    return await this.httpClient.delete(`${this.microservice}/${this.endpoint}/${id}`);
  }

  // Métodos adicionales específicos para retenciones
  async getRetentionsByFilter(filterParams) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/filter`,
      { params: filterParams }
    );
  }

  async getRetentionsByPeriod(startDate, endDate) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/period`,
      { params: { startDate, endDate } }
    );
  }
}

export default RetentionsService;