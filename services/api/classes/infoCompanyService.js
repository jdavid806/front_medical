import BaseApiService from "./baseApiService.js";

export class InfoCompanyService extends BaseApiService {
    
    async getCompany() {
        return await this.httpClient.get(`medical/companies`);
    }

    async getInfoCommunication(companyId) {
        return await this.httpClient.get(`${this.microservice}/companies/${companyId}/communication`);
    }

}

export default InfoCompanyService;