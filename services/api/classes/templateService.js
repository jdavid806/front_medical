import BaseApiService from "./baseApiService";

export class TemplateService extends BaseApiService {
  async storeTemplate(data) {
    return await this.httpClient.post(
      this.microservice + "/" + "template-create",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async getTemplate(data) {
    return await this.httpClient.get(
      `${this.microservice}/message-templates/filter/${data.tenantId}/${data.belongsTo}/${data.type}`
    );
  }
}

export default TemplateService;
