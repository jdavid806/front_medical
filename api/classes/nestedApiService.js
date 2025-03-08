import { httpClient } from './httpClient'; // Asegúrate de importar tu cliente HTTP

export class OneToManyService {
    constructor(parentEndpoint, childEndpoint) {
        this.parentEndpoint = parentEndpoint;
        this.childEndpoint = childEndpoint;
    }

    async ofParent(parentId) {
        try {
            const url = `${this.parentEndpoint}/${parentId}/${this.childEndpoint}`;
            return await httpClient.get(url);
        } catch (error) {
            console.error(`Error getting ${this.childEndpoint} for parent ${parentId}:`, error);
            throw error;
        }
    }

    async createForParent(parentId, data) {
        try {
            const url = `${this.parentEndpoint}/${parentId}/${this.childEndpoint}`;
            return await httpClient.post(url, data);
        } catch (error) {
            console.error(`Error creating ${this.childEndpoint} for parent ${parentId}:`, error);
            throw error;
        }
    }

    async createManyForParent(parentId, dataArray) {
        try {
            const url = `${this.parentEndpoint}/${parentId}/${this.childEndpoint}/bulk`;
            return await httpClient.post(url, dataArray);
        } catch (error) {
            console.error(`Error creating multiple ${this.childEndpoint} for parent ${parentId}:`, error);
            throw error;
        }
    }

    async update(childId, data) {
        try {
            const url = `${this.parentEndpoint}/${this.childEndpoint}/${childId}`;
            return await httpClient.put(url, data);
        } catch (error) {
            console.error(`Error updating ${this.childEndpoint} ${childId}:`, error);
            throw error;
        }
    }

    async delete(childId) {
        try {
            const url = `${this.parentEndpoint}/${this.childEndpoint}/${childId}`;
            return await httpClient.delete(url);
        } catch (error) {
            console.error(`Error deleting ${this.childEndpoint} ${childId}:`, error);
            throw error;
        }
    }
}