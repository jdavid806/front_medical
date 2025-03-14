import OneToManyService from './oneToManyService.js';

export class DepartmentService extends OneToManyService {
    async getAll() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, name: 'Santo Domingo' },
                    { id: 2, name: 'Santiago Rodríguez' },
                    { id: 3, name: 'Puerto Plata' },
                    { id: 4, name: 'La Vega' },
                    { id: 5, name: 'Duarte' },
                    { id: 6, name: 'La Romana' },
                    { id: 7, name: 'Samaná' }
                ]);
            }, 500);
        });
    }
    async getDepartments(countryId) {
        return await this.httpClient.get(`${this.microservice}/countries/${countryId}/${this.endpoint}`)
    }

    async getByCountry(countryId) {
        return await this.httpClient.get(`${this.microservice}/departments/${countryId}`)
    }
}

export default DepartmentService;