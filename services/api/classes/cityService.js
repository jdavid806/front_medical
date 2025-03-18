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

    async getByCountry(countryId) {
        try {
            const url = `${this.microservice}/cities/by-country/${countryId}`;
            return await this.httpClient.get(url);
        } catch (error) {
            console.error(`Error getting cities for country ${countryId}:`, error);
            throw error;
        }
    }
}

export default CityService;