import { url } from '../../globalMedical.js';
import BaseApiService from './baseApiService.js';

export class AuthService extends BaseApiService {
    async login(data) {
        return await this.httpClient.post(`${this.microservice}/login`, data)
    }

    async register(data) {
        // console.log(url, url.split('.').slice(0, 3).join('.').replace('/', ''));

        return await this.httpClient.post(`${this.microservice}/register`, data, {
            "X-DOMAIN": 'dev.monaros.co'
        })
    }
}

export default AuthService;