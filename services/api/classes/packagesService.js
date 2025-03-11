import BaseApiService from './baseApiService.js';

export class PackagesService extends BaseApiService {
    async getAllPackages() {
        return await this.httpClient.get(`${this.microservice}/packages`)
    }
}

export default PackagesService;