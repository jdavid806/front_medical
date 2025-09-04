import BaseApiService from "./baseApiService";

export class ManualUsuarioVideoService extends BaseApiService {
  async getAllCategoriesWithVideos() {
    return await this.httpClient.get("medical/video-tutorial-categories");
  }

  async createCategory(category) {
    return await this.httpClient.post("medical/video-tutorial-categories", category);
  }

  async createVideo(video) {
    return await this.httpClient.post("medical/video-tutorials", video);
  }
}
