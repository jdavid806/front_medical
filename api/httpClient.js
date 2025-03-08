import { url } from '../globalMedical.js';

class HttpClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    async request(endpoint, method, data = null) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method,
                headers: this.defaultHeaders,
                mode: "cors",
                body: data ? JSON.stringify(data) : null,
            });

            if (!response.ok) {
                throw new Error(`Error en la red: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error en petición ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint, "GET");
    }

    post(endpoint, data) {
        return this.request(endpoint, "POST", data);
    }

    // Agregar otros métodos según necesidad (put, delete, etc)
}

export const httpClient = new HttpClient(url);