import OneToManyService from './oneToManyService.js';

export class CityService extends OneToManyService {
    async getByDepartment(departmentId) {
        try {
            const url = `${this.microservice}/cities/${departmentId}`;
            return await this.httpClient.get(url);
        } catch (error) {
            console.error(`Error getting cities for department ${departmentId}:`, error);
            throw error;
        }
    }
}

export default CityService;