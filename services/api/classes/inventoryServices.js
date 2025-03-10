import BaseApiService from './baseApiService.js';


export class InventoryService extends BaseApiService {

    async getAll() {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
    }

    async getById(id) {
        return await this.httpClient.get(`api/v1/admin/products/${id}`);
    }
    async storeProduct(data) {
        return await this.httpClient.post(`${this.microservice}/product-create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
    }
    async deleteProduct(id) {
        return await this.httpClient.delete(`api/v1/admin/products/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    async updateProduct(id, data) {
        return await this.httpClient.put(`api/v1/admin/products/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'mode': "cors"
            }
        });
    }
    

}
export default InventoryService;