import BaseApiService from './baseApiService.js';

export class SuppliesService extends BaseApiService {
    async getAllSupplies() {
        return await this.httpClient.get(`${this.microservice}/medical-supplies/`)
    }

    async filterSupplies({ search, status }) {
        return await this.httpClient.get(`${this.microservice}/medical-supplies`, { search, status })
    }

    async getSuppliesById(productId) {
        return await this.httpClient.get(`${this.microservice}/medical-supplies/${productId}`)
    }


    async storeSupply(data) {
        // console.log(data)
        return await this.httpClient.post(this.microservice + '/medical-supplies/', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async cancelSupply(id) {
        return await this.httpClient.put(`${this.microservice}/medical-supplies/ ${id}/cancel`)
    }

    async validateSupply($id, data) {
        return await this.httpClient.patch(`${this.microservice}/medical-supplies/${$id}/validate-delivery`, data)
    }
}

export default SuppliesService;