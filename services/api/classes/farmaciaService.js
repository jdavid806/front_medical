import BaseApiService from './baseApiService.js';

export class FarmaciaService extends BaseApiService {
    async getAllRecipes() {
        return await this.httpClient.get(`${this.microservice}/recipes`);
    }
    async getAllprescriptions() {
        return await this.httpClient.get(`${this.microservice}/prescriptions`);
    }
    async getRecipesById(id) {
        return await this.httpClient.get(`${this.microservice}/recipes/${id}`);
    }
    async getPrescriptionsByid(id) {
        return await this.httpClient.get(`${this.microservice}/prescriptions/${id}`);
    }


}

export default FarmaciaService;