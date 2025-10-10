import BaseApiService from "./baseApiService";

export class ConvenioTenantService extends BaseApiService {

    async getTenantWithDomainById(id) {
        return await this.httpClient.get(`medical/domains/${id}`);
    }

    async getConveniosActivos() {
        return await this.httpClient.get(`medical/convenios/activos`);
    }

    async getFarmaciasWithRecetasConvenio(data, tenantId, apiKey) {
        return await this.httpClient.get(
            `medical/convenios/farmacia/recetas`,
            data,
            {
                "X-TENANT-ID": tenantId,
                "X-API-KEY": apiKey
            }
        );
    }

    //listar todo los clientes disponibles para hacer convenio
    async getConveniosAvailable() {
        return await this.httpClient.get(`medical/domains`);
    }

    async createConvenio(data) {
        return await this.httpClient.post(`medical/convenios`, data);
    }

    async cancelConvenio(id) {
        return await this.httpClient.delete(`medical/convenios/${id}`);
    }
}
