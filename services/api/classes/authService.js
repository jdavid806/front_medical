import BaseApiService from './baseApiService.js';

export class AuthService extends BaseApiService {
    async login(credentials) {
        return await this.httpClient.post(`${this.microservice}/login`, credentials, {
            headers: {
                'X-Domain': window.location.hostname
            }
        });
    }

    async register(data) {
        return await this.httpClient.post(`${this.microservice}/register`, data, {
            headers: {
                "X-DOMAIN": window.location.hostname
            }
        });
    }

    async sendOTP(data) {
        return await this.httpClient.post(`${this.microservice}/otp/send-otp`, data);
    }

    async validateOTP(otp) {
        return await this.httpClient.post(`${this.microservice}/otp/validate-otp`, otp);
    }

    async changePassword(data) {
        console.log(window.location.hostname);
        return await this.httpClient.post(`${this.microservice}/change-password`, data,
            {
                headers: {
                    'X-DOMAIN': window.location.hostname
                }
            })
    }
}

export default AuthService;