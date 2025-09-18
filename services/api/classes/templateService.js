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

  async getByPatientId(patientId) {
    return await this.httpClient.get(`api/v1/firma/templates/${patientId}`);
  }

  async storeTemplateDocument(data) {
  return await this.httpClient.post(
    "api/v1/firma/templates/create",
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

  async updateTemplate(id, data) {
    return await this.httpClient.put(
      `api/v1/firma/templates/update/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async deleteTemplate(id) {
    return await this.httpClient.delete(`api/v1/firma/templates/delete/${id}`);
  }
}

export default TemplateService;
