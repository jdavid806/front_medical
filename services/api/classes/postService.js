import BaseApiService from "./baseApiService";

export class PostService extends BaseApiService {
  async getAllPosts() {
    return await this.httpClient.get(`${this.microservice}/posts`);
  }

  async getPost(id) {
    return await this.httpClient.get(`${this.microservice}/posts/${id}`);
  }

  async createPost(data) {
    return await this.httpClient.post(`${this.microservice}/posts`, data, {
      headers:
        data instanceof FormData ? {} : { "Content-Type": "application/json" },
    });
  }
}

export default PostService;
