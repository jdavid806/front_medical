import { url } from '../../globalMedical.js';
import BaseApiService from './baseApiService.js';

export class AuthService extends BaseApiService {
    async login(credentials) {
        return await this.httpClient.post(`${this.microservice}/login`, credentials, {
            'X-DOMAIN': url.split('/')[0]
        });
    }

    async register(data) {
        return await this.httpClient.post(`${this.microservice}/register`, data, {
            "X-DOMAIN": url.split('/')[0]
        });
    }

    async sendOTP(data) {
        return await this.httpClient.post(`${this.microservice}/otp/send-otp`, data);
    }

    async validateOTP(otp) {
        return await this.httpClient.post(`${this.microservice}/otp/validate-otp`, otp);
    }

    async changePassword(data) {
        return await this.httpClient.post(`${this.microservice}/change-password`, data, {
            'X-DOMAIN': url.split('/')[0]
        })
    }

    async verifySupervisor(data = { external_id, password }) {
        return await this.httpClient.post(`${this.microservice}/check-supervisor`, data);
    }

    async checkUsernameByTenant(username) {
        return await this.httpClient.post(`${this.microservice}/check-username-by-tenant`, {
            "username": username,
            "tenant_id": url.split('.')[0],
        })
    }

    async checkUserByExternalId(externalId) {
        return await this.httpClient.post(`${this.microservice}/check-user-by-external`, {
            "external_id": externalId,
            "tenant_id": url.split('.')[0],
        })
    }
}

export default AuthService;