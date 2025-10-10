import BaseApiService from "./baseApiService.js";

export class GoogleCalendarService extends BaseApiService {
    async saveConfig(userId, config) {
        return await this.httpClient.post(
            `${this.microservice}/users/${userId}/google-calendar-config`,
            config
        );
    }
}

export default GoogleCalendarService;