import BaseApiService from "./baseApiService";

export class PaymentMethodService extends BaseApiService {
    async getPaymentMethods() {
        return await this.httpClient.get(this.microservice + "/" + this.endpoint);
    }

    async getPaymentMethodById(id) {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/${id}`);
    }

    async storePaymentMethod(data) {
        return await this.httpClient.post(this.microservice + "/" + this.endpoint, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


    async updatePaymentMethod(id, data) {
        return await this.httpClient.put(`${this.microservice}/${this.endpoint}/${id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async deletePaymentMethod(id) {
        return await this.httpClient.delete(`${this.microservice}/${this.endpoint}/${id}`);
    }
}

export default PaymentMethodService;