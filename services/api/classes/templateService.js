import BaseApiService from "./baseApiService";

export class TemplateService extends BaseApiService {

    async storeTemplate(data) {
        return await this.httpClient.post(this.microservice + "/" + 'template-create', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
}

export default TemplateService;
