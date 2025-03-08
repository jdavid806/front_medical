import { url } from '../../globalMedical.js';
import HttpClient from "./httpClient.js";

export class BaseApiService {
    constructor(microservice, endpoint) {
        this.endpoint = endpoint;
        this.microservice = microservice
        this.httpClient = new HttpClient(url);
    }

    async getAll() {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
    }

    async get(id) {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/${id}`);
    }

    async create(data) {
        return await this.httpClient.post(`${this.microservice}/${this.endpoint}`, data);
    }

    async update(id, data) {
        return await this.httpClient.put(`${this.microservice}/${this.endpoint}/${id}`, data);
    }

    async delete(id) {
        return await this.httpClient.delete(`${this.microservice}/${this.endpoint}/${id}`);
    }

    async activeCount() {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/active/count`);
    }

    async active() {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/active/all`);
    }
}

export default BaseApiService;