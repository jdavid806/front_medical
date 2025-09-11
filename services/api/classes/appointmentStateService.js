import BaseApiService from "./baseApiService.js";

export class AppointmentStateService extends BaseApiService {

    async getAll() {
        return await this.httpClient.get(`medical/appointment-states`);
    }
}

export default AppointmentStateService;
