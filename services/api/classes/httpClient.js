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

    async request(endpoint, method, data = null, params = null, customHeaders = {}) {
        try {
            // Fusionar los headers por defecto con los headers personalizados
            const headers = {
                ...this.defaultHeaders,
                ...customHeaders,
            };


            // console.log(this.defaultHeaders, customHeaders);

            if (customHeaders["X-DOMAIN"]) {
                // console.log('repetido xd');

                delete headers["X-DOMAIN"];
                headers["X-DOMAIN"] = customHeaders["X-DOMAIN"];
            }

            const response = await fetch(`https://${this.baseUrl}${endpoint}?${params}`, {
                method,
                headers,
                body: data ? JSON.stringify(data) : null,
            });

            const responseData = await response.json();

            if (!response.ok) {
                const error = new Error(responseData.message || 'Error en la solicitud');
                error.response = response;
                error.data = responseData;
                throw error;
            }

            return responseData;
        } catch (error) {
            console.error(`Error en petición ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    async get(endpoint, data = null, customHeaders = {}) {
        const params = new URLSearchParams();
        if (data) {
            Object.keys(data).forEach((key) => {
                if (data[key] !== undefined && data[key] !== null) {
                    params.set(key, data[key]);
                }
            });
        }
        return await this.request(endpoint, "GET", null, params, customHeaders);
    }

    async post(endpoint, data, customHeaders = {}) {
        return await this.request(endpoint, "POST", data, null, customHeaders);
    }

    async patch(endpoint, data, customHeaders = {}) {
        return await this.request(endpoint, "PATCH", data, null, customHeaders);
    }

    async put(endpoint, data, customHeaders = {}) {
        return await this.request(endpoint, "PUT", data, null, customHeaders);
    }

    async delete(endpoint, data, customHeaders = {}) {
        return await this.request(endpoint, "DELETE", data, null, customHeaders);
    }
}

export default HttpClient;