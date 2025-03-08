import { httpClient } from './httpClient';

export class BaseApiService {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    getAll(params) {
        return httpClient.get(this.endpoint, { params });
    }

    get(id) {
        return httpClient.get(`${this.endpoint}/${id}`);
    }

    create(data) {
        return httpClient.post(this.endpoint, data);
    }

    update(id, data) {
        return httpClient.put(`${this.endpoint}/${id}`, data);
    }

    delete(id) {
        return httpClient.delete(`${this.endpoint}/${id}`);
    }
}

export default BaseApiService;