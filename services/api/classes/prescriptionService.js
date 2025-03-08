import BaseApiService from "./baseApiService";

export class PrescriptionService extends BaseApiService {
    async getPrescriptions() {
        return await this.httpClient.get(this.microservice + "/" + 'recipes');
    }

    async storePrescription(data) {
        return await this.httpClient.post(this.microservice + "/" + 'recipes', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


    
}


export default PrescriptionService;
