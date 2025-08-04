import BaseApiService from "./baseApiService.js";

export class GeneralRequestService extends BaseApiService {

    async filterRequests(filters) {
        return await this.httpClient.get(`medical/general-requests`, filters);
    }

    async makeRequest(data) {
        return await this.httpClient.post(`medical/general-requests`, data);
    }

    async resolveRequest(requestId, data) {
        return await this.httpClient.post(`medical/general-requests/solve/${requestId}`, data);
    }
}

export default GeneralRequestService;