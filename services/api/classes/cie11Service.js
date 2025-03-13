import BaseApiService from "./baseApiService.js";

export class Cie11Service extends BaseApiService {
  async getCie11All() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
  }

  async getCie11ByCode(code) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/get-by-code/${code}`
    );
  }
}

export default Cie11Service;
