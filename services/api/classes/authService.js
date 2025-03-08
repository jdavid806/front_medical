import BaseApiService from './baseApiService.js';

export class AuthService extends BaseApiService {
    async login(data) {
        return await this.httpClient.post(`${this.endpoint}/login`, data)
    }
}

export default AuthService;