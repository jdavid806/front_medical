import BaseApiService from './baseApiService.js';

export class CupsService extends BaseApiService {
    async getCupsAll() {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}`)
    }

}

export default CupsService;
