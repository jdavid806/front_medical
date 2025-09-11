import BaseApiService from "./baseApiService";

export class ExamRecipeService extends BaseApiService {
  async ofPatient(patientId) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/of-patient/${patientId}`
    );
  }

  async pendingOfPatient(patientId) {
    console.log("xd no me jodas");

    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/pending/of-patient/${patientId}`
    );
  }

  async lastByPatient(patientId) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/last-by-patient/${patientId}`
    );
  }

  async cancel(id) {
    return await this.httpClient.put(
      `${this.microservice}/${this.endpoint}/change-status/${id}/canceled`
    );
  }

  async changeStatus(id, status) {
    return await this.httpClient.put(
      `${this.microservice}/${this.endpoint}/change-status/${id}/${status}`
    );
  }

}
