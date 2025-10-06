import BaseApiService from "./baseApiService";

export class LandingAvailabilities extends BaseApiService {
    async getLandingAvailabilities() {
        return await this.httpClient.get(`medical/landing-availabilities`);
    }

}
