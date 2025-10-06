import BaseApiService from "./baseApiService";
import { url } from "../../globalMedical";

export class TenantConfigService extends BaseApiService {
    tenantId = url.split('.')[0];

    async getConfig() {
        return await this.httpClient.get(`medical/tenants/${this.tenantId}/config`);
    }

    async saveConfig(configData) {
        return await this.httpClient.post(`medical/tenants/${this.tenantId}/config`, {
            config_tenants: configData
        });
    }

    async deleteConfig() {
        return await this.httpClient.delete(`medical/tenants/${this.tenantId}/config`);
    }

    async updateConfigProgress(stepId, stepIndex, finishedConfiguration = false) {
        const configData = {
            current_step: stepId,
            step_index: stepIndex,
            finished_configuration: finishedConfiguration,
            last_updated: new Date().toISOString()
        };

        console.log('💾 Enviando datos de progreso:', configData);
        return await this.saveConfig(configData);
    }
}

export const tenantConfigService = new TenantConfigService();