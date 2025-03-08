import BaseApiService from './baseApiService'

export class ManyToManyService extends BaseApiService {
    constructor(parentEndpoint, childEndpoint) {
        this.parentEndpoint = parentEndpoint;
        this.childEndpoint = childEndpoint;
    }

    async ofParent(parentId) {
        try {
            const url = `${this.parentEndpoint}/${parentId}/${this.childEndpoint}`;
            return await this.get(url);
        } catch (error) {
            console.error(`Error getting ${this.childEndpoint} for parent ${parentId}:`, error);
            throw error;
        }
    }

    async createForParent(parentId, childrenIds) {
        try {
            const url = `${this.parentEndpoint}/${parentId}/${this.childEndpoint}`;
            return await this.post(url, { children_ids: childrenIds });
        } catch (error) {
            console.error(`Error creating ${this.childEndpoint} relations for parent ${parentId}:`, error);
            throw error;
        }
    }

    async updateForParent(parentId, childrenIds) {
        try {
            const url = `${this.parentEndpoint}/${parentId}/${this.childEndpoint}`;
            return await this.put(url, { children_ids: childrenIds });
        } catch (error) {
            console.error(`Error updating ${this.childEndpoint} relations for parent ${parentId}:`, error);
            throw error;
        }
    }

    async deleteForParent(parentId, childrenIds) {
        try {
            const url = `${this.parentEndpoint}/${parentId}/${this.childEndpoint}`;
            return await this.delete(url, { data: { children_ids: childrenIds } });
        } catch (error) {
            console.error(`Error deleting ${this.childEndpoint} relations for parent ${parentId}:`, error);
            throw error;
        }
    }
}

export default ManyToManyService