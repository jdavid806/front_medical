import BaseApiService from "./baseApiService";

export class PaymentMethodService extends BaseApiService {
    async getPaymentMethods() {
        return await this.httpClient.get(this.microservice + "/" + this.endpoint);
    }

    async storePaymentMethod(data) {
        return await this.httpClient.post(this.microservice + "/" + this.endpoint, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }    
}


export default PaymentMethodService;
