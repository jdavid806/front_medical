import OneToManyService from './oneToManyService.js';

export class AppointmentService extends OneToManyService {
    async updateAppointmentStatus(taskId, status) {
        try {
            const url = `${this.microservice}/${this.childEndpoint}/${taskId}`;
            return await this.httpClient.patch(url, { appointment_state_id: status });
        } catch (error) {
            console.error(`Error getting ${this.childEndpoint} for parent ${parentId}:`, error);
            throw error;
        }
    }
}

export default AppointmentService;