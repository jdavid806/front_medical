import BaseApiService from "./baseApiService";

export class TaxService extends BaseApiService {
    async getTaxes() {
        return await this.httpClient.get(this.microservice + "/" + this.endpoint);
    }

    async getTaxById(id) {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/${id}`);
    }

    async storeTax(data) {
        return await this.httpClient.post(
            this.microservice + "/" + this.endpoint,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    async updateTax(id, data) {
        return await this.httpClient.put(
            `${this.microservice}/${this.endpoint}/${id}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    async deleteTax(id) {
        return await this.httpClient.delete(`${this.microservice}/${this.endpoint}/${id}`);
    }

}

export default TaxService;