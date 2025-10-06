import BaseApiService from "./baseApiService.js";

export class GenericFilterServices extends BaseApiService {

  async searchModel(model, filters = {}) {
    return await this.httpClient.post(`medical/filter/${model}`, filters);
}
}

export default GenericFilterServices;
