import { url } from '../../globalMedical.js';
import HttpClient from "./httpClient.js";

export class BaseApiService {
    constructor(microservice, endpoint, version = "") {
        this.endpoint = endpoint;
        this.microservice = microservice
        this.version = version;
        this.httpClient = new HttpClient(url);
    }

    async getAll() {
        return await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}`);
    }

    async get(id) {
        return await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}/${id}`);
    }

    async create(data) {
        return await this.httpClient.post(`${this.microservice}${this.version}/${this.endpoint}`, data);
    }

    async bulkCreate(data) {
        return await this.httpClient.post(`${this.microservice}${this.version}/${this.endpoint}/bulk/store`, data);
    }

    async update(id, data) {
        return await this.httpClient.put(`${this.microservice}${this.version}/${this.endpoint}/${id}`, data);
    }

    async delete(id) {
        return await this.httpClient.delete(`${this.microservice}${this.version}/${this.endpoint}/${id}`);
    }

    async activeCount() {
        return await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}/active/count`);
    }

    async active() {
        return await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}/active/all`);
    }
}

export default BaseApiService;