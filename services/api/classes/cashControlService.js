import BaseApiService from "./baseApiService.js";

export class CashControlService extends BaseApiService {

    async report(filters) {
        return await this.httpClient.post(`${this.microservice}/${this.endpoint}/report/filter`, filters);
    }
}

export default CashControlService;
