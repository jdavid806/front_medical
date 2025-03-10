import BaseApiService from './baseApiService.js';

export class ProductService extends BaseApiService {
    async getAllProducts() {
        return await this.httpClient.get(`${this.microservice}/products-all`)
    }

    async getProductById(productId) {
        return await this.httpClient.get(`${this.microservice}/product/${productId}`)
    }

    async getService() {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}`)
    }


    async storeProduct(data) {
        return await this.httpClient.post(this.microservice + "/" + 'product-create', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async getProductTypes() {
        return await this.httpClient.get(`${this.microservice}/products-types`)
    }

    
    async deleteProduct(productId) {
        return await this.httpClient.post(this.microservice + "/" + 'products', productId, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export default ProductService;