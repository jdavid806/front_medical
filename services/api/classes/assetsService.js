import BaseApiService from "./baseApiService.js";

export class AssetsService extends BaseApiService {

    async getAll() {
        return await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}/query?include=category,user`);
    }

    async updateAssetStatus(assetId, body) {
      console.log(`Updating asset status:`, assetId, body);
      try {
        const url = `api/v1/admin/assets/${assetId}/status`;
        return await this.httpClient.patch(url, body );
      } catch (error) {
        console.error(
          `Error updating ${error.response?.data?.message} for asset ${assetId}:`,
          error
        );
        throw error;
      }
    }
}

export default AssetsService;
