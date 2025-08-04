import BaseApiService from "./baseApiService";

export class CommentsService extends BaseApiService {
  async getCommentsByPost() {
    return await this.httpClient.get(`${this.microservice}/comments`);
  }

  async createComment(data) {
    return await this.httpClient.post(`${this.microservice}/comments`, data);
  }
}

export default CommentsService;
