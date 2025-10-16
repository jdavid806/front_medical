import { cleanJsonObject } from "../../utilidades";
import BaseApiService from "./baseApiService";

export class PrescriptionService extends BaseApiService {
  async getPrescriptions(type = "") {
    return await this.httpClient.get(this.microservice + "/" + "recipes", cleanJsonObject({
      type: type,
    }));
  }

  async storePrescription(data) {
    return await this.httpClient.post(
      this.microservice + "/" + "recipes",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async getLastByPatientId(patientId, type) {
    return await this.httpClient.get(
      this.microservice + "/recipes/last-of/patient/" + patientId + '/' + type
    );
  }

  async getConvenioRecipeById(id, data, tenantId, apiKey) {
    return await this.httpClient.get(
      this.microservice + "/convenios/recipes/" + id,
      data,
      {
        "X-TENANT-ID": tenantId,
        "X-API-KEY": apiKey
      }
    );
  }
}

export default PrescriptionService;
