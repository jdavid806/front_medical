import BaseApiService from "./baseApiService.js";

export class MassMessagingService extends BaseApiService {

    async sendMessage(data, headers) {
        return await this.httpClient.post(`${this.microservice}/message/send`, data, headers);
    }

}

export default MassMessagingService;