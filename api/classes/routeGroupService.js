// services/RouteGroupService.js
import { httpClient } from './httpClient';

export class RouteGroupService {
    constructor(basePath) {
        this.basePath = basePath;
    }

    getAll(parentId) {
        return httpClient.get(`${this.basePath}/${parentId}`);
    }

    getByChildType(parentId, childType) {
        return httpClient.get(`${this.basePath}/${parentId}/${childType}`);
    }

    create(parentId, data) {
        return httpClient.post(`${this.basePath}/${parentId}`, data);
    }

    update(parentId, data) {
        return httpClient.put(`${this.basePath}/${parentId}`, data);
    }

    delete(parentId) {
        return httpClient.delete(`${this.basePath}/${parentId}`);
    }
}