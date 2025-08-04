import { cleanJsonObject } from '../../utilidades.js';
import BaseApiService from './baseApiService.js';

export class PurchaseOrderService extends BaseApiService {

    constructor() {
        super("api/v1/admin", "purchase-orders");
    }

    async filter(data) {
        return await this.httpClient.get(
            `${this.microservice}/${this.endpoint}/query/filter`,
            cleanJsonObject(data)
        );
    }

    async getById(purchaseOrderId) {
        return await this.httpClient.get(
            `${this.microservice}/${this.endpoint}/${purchaseOrderId}`
        );
    }
}

export default PurchaseOrderService;