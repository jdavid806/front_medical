import BaseApiService from './baseApiService.js';

export class OneToManyService extends BaseApiService {
    constructor(microservice, parentEndpoint, childEndpoint) {
        super(microservice, childEndpoint)
        this.microservice = microservice
        this.parentEndpoint = parentEndpoint;
        this.childEndpoint = childEndpoint;
    }

    async ofParent(parentId) {
        try {
            const url = `${this.microservice}/${this.parentEndpoint}/${parentId}/${this.childEndpoint}`;
            return await this.httpClient.get(url);
        } catch (error) {
            console.error(`Error getting ${this.childEndpoint} for parent ${parentId}:`, error);
            throw error;
        }
    }

    async ofParentByType(type, parentId) {
        try {
            const url = `${this.microservice}/clinical-records/get-by-type/${type}/${parentId}`;
            return await this.httpClient.get(url);
        } catch (error) {
            console.error(`Error getting ${this.childEndpoint} for parent ${parentId}:`, error);
            throw error;
        }
    }

    async createForParent(parentId, data) {
        try {
            const url = `${this.microservice}/${this.parentEndpoint}/${parentId}/${this.childEndpoint}`;
            // console.log(url);

            return await this.httpClient.post(url, data);
        } catch (error) {
            console.error(`Error creating ${this.childEndpoint} for parent ${parentId}:`, error);
            throw error;
        }
    }

    async updateForParent(id, data) {
        try {
            const url = `${this.microservice}/clinical-records/${id}`;
            // console.log(url);

            return await this.httpClient.patch(url, data);
        } catch (error) {
            console.error(`Error updating ${this.childEndpoint} for parent ${id}:`, error);
            throw error;
        }
    }

    async createManyForParent(parentId, dataArray) {
        try {
            const url = `${this.microservice}/${this.parentEndpoint}/${parentId}/${this.childEndpoint}/bulk`;
            return await this.httpClient.post(url, dataArray);
        } catch (error) {
            console.error(`Error creating multiple ${this.childEndpoint} for parent ${parentId}:`, error);
            throw error;
        }
    }
}

export default OneToManyService;