import BaseApiService from "./baseApiService.js";

export class GoogleCalendarService extends BaseApiService {

    async getConfig(userId) {
        return await this.httpClient.get(
            `medical/google-calendar/config/${userId}`
        );
    }

    async saveConfig(config) {
        return await this.httpClient.post(
            `medical/google-calendar/connect`,
            config
        );
    }

    async createConfig(config) {
        return await this.httpClient.post(
            `medical/google-calendar/create-event`,
            config
        );
    }
}

export default GoogleCalendarService;