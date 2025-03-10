import BaseApiService from "./baseApiService";

export class TicketService extends BaseApiService {
    async getAllByReasons(reasons) {
        return await this.httpClient.post(`${this.microservice}/${this.endpoint}/by-reasons`, {
            reasons
        })
    }
}
