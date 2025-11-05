import { url } from '../globalMedical.js';

class HttpClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    // Método genérico para todas las peticiones
    async request(endpoint, method = "GET", data = null, token = null) {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        const headers = { ...this.defaultHeaders };

        // Si nos pasan token, lo agregamos a los headers
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(fullUrl, {
                method,
                headers,
                mode: "cors",
                body: data ? JSON.stringify(data) : null,
            });

            if (!response.ok) {
                throw new Error(`Error en la red: ${response.status} - ${response.statusText}`);
            }

            // Intentar parsear JSON, si no hay contenido, devolver null
            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } catch (error) {
            console.error(`Error en petición ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    // Métodos de conveniencia
    get(endpoint, token = null) {
        return this.request(endpoint, "GET", null, token);
    }

    post(endpoint, data, token = null) {
        return this.request(endpoint, "POST", data, token);
    }

    put(endpoint, data, token = null) {
        return this.request(endpoint, "PUT", data, token);
    }

    delete(endpoint, token = null) {
        return this.request(endpoint, "DELETE", null, token);
    }
}

export const httpClient = new HttpClient(url);
