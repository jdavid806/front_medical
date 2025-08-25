import BaseApiService from "./baseApiService.js";

export class consentimientoService extends BaseApiService {
    async getAll() {
        return await this.httpClient.get(`api/v1/firma/template_documents`);
    }

    async create(data) {
        return await this.httpClient.post(`api/v1/firma/template_documents`, data);
    }

    async update(id, data) {
        return await this.httpClient.put(`api/v1/firma/template_documents/${id}`, data);
    }

    async delete(id) {
        return await this.httpClient.delete(`api/v1/firma/template_documents/${id}`);
    }

    async getTemplate() {
        return await this.httpClient.get(`api/v1/firma/template-types`);
    }

}
export default consentimientoService;