import BaseApiService from "./baseApiService";

export class UserAssistantService extends BaseApiService {
    constructor() {
        super("medical", "user-assistants", "/v2");
    }

    getAssistantsByUserId(userId) {
        return this.httpClient.get(`${this.microservice}${this.version}/users/${userId}/assistants`);
    }
}
