import BaseApiService from './baseApiService.js';

export class SystemConfigService extends BaseApiService {

    async getAllSystemConfigs() {
        return await this.httpClient.get(`medical/system-configs/`);
    }

    async storeSystemConfig(systemConfig) {
        return await this.httpClient.post(`medical/system-configs/`, systemConfig)
    }
}

export default SystemConfigService;