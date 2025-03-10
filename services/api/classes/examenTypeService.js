import BaseApiService from './baseApiService.js';

export class ExamenTypeService extends BaseApiService {
    async getExamenTypes() {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}`)
    }

    async getExamenType(id) {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/${id}`);
    }
}

export default ExamenTypeService;
