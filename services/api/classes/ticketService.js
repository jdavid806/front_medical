import BaseApiService from "./baseApiService";

export class TicketService extends BaseApiService {
    async getAllByReasons(reasons) {
        return await this.httpClient.post(`${this.microservice}/${this.endpoint}/by-reasons`, {
            reasons
        })
    }

    async lastByPatient(patientId){
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/last-by-patient/${patientId}`)
    }
}
