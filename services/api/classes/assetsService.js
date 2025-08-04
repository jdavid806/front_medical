import BaseApiService from "./baseApiService.js";

export class AssetsService extends BaseApiService {

    async getAll() {
        return await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}/query?include=category,user`);
    }
}

export default AssetsService;
