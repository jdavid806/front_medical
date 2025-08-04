import BaseApiService from './baseApiService.js';

export class EstimateService extends BaseApiService {
    async getAllEstimates() {
        //console.log(this.microservice);
        return await this.httpClient.get(`${this.microservice}/estimates`)
    }
}

export default EstimateService;