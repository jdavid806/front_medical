import BaseApiService from "./baseApiService.js";

export class AppointmentTypeService extends BaseApiService {

    async getAll() {
        return await this.httpClient.get(`medical/appointment-types`);
    }
}

export default AppointmentTypeService;
