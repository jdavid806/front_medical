import OneToManyService from './oneToManyService.js';

export class UserAvailabilityService extends OneToManyService {
    async availableBlocks(data = { user_specialty_id, user_id, period }) {
        return await this.httpClient.get(`${this.microservice}/user-availabilities/available-blocks`, data);
    }
}

export default UserAvailabilityService;
