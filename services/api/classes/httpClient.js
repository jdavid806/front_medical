import { url } from "../../globalMedical";
import { getJWTPayload } from "../../utilidades";

export class HttpClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-DOMAIN": url.split('.')[0],
            "X-External-ID": getJWTPayload().sub,
        };
    }

    async request(endpoint, method, data = null, params = null, customHeaders = {}) {
        try {
            // Fusionar headers
            const headers = {
                ...this.defaultHeaders,
                ...customHeaders,
            };

            // Manejar headers especiales
            if (customHeaders["X-DOMAIN"]) {
                headers["X-DOMAIN"] = customHeaders["X-DOMAIN"];
            }
            if (customHeaders["X-External-ID"]) {
                headers["X-External-ID"] = customHeaders["X-External-ID"];
            }

            // Construir URL de forma segura
            const url = new URL(`https://${this.baseUrl}${endpoint}`);
            
            // Añadir parámetros solo si existen
            if (params instanceof URLSearchParams && params.toString()) {
                url.search = params.toString();
            }

            const response = await fetch(url.toString(), {
                method,
                headers,
                body: data ? JSON.stringify(data) : null,
            });

            // Procesar respuesta
            const contentType = response.headers.get("content-type");
            let responseData = contentType?.includes("application/json") 
                ? await response.json() 
                : await response.text();

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