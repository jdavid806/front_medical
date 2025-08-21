import BaseApiService from './baseApiService.js';

export class AuthService extends BaseApiService {
    async login(data) {
        return await this.httpClient.post(`${this.microservice}/login`, data)
    }

    async register(data) {
        return await this.httpClient.post(`${this.microservice}/register`, data, {
            "X-DOMAIN": window.location.hostname
        })
    }
}

export default AuthService;