import { url } from "../../globalMedical";

export class HttpClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-DOMAIN": url.split('.')[0],
        };
    }

    async request(endpoint, method, data = null, params = null) {
        try {
            const response = await fetch(`http://${this.baseUrl}${endpoint}?${params}`, {
                method,
                headers: this.defaultHeaders,
                body: data ? JSON.stringify(data) : null,
            });

            const responseData = await response.json();

            if (!response.ok) {
                const error = new Error(responseData.message || 'Error en la solicitud');
                error.response = response;
                error.data = responseData;
                throw error;
            }

            return responseData
        } catch (error) {
            console.error(`Error en petición ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    async get(endpoint, data = null) {
        const params = new URLSearchParams();
        if (data) {
            Object.keys(data).forEach((key) => {
                if (data[key] !== undefined && data[key] !== null) {
                    params.set(key, data[key]);
                }
            });
        }
        return await this.request(endpoint, "GET", null, params);
    }

    async post(endpoint, data) {
        return await this.request(endpoint, "POST", data);
    }

    async patch(endpoint, data) {
        return await this.request(endpoint, "PATCH", data);
    }

    async put(endpoint, data) {
        return await this.request(endpoint, "PUT", data);
    }

    async delete(endpoint, data) {
        return await this.request(endpoint, "DELETE", data);
    }
}

export default HttpClient;