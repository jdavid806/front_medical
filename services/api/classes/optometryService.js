import BaseApiService from "./baseApiService.js";

export class OptometryService extends BaseApiService {

  constructor() {
    super("medical", "recipes");
  }

  async getAllOptometryRecipes() {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}?type=optometry`
    );
  }

  async getRecipeInvoiceStatus(recipeId) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/${recipeId}/invoice-status`
    );
  }

  // Puedes agregar más métodos según necesites, por ejemplo:
  async createOptometryRecipe(data, receiptId) {
    return await this.httpClient.post(
      `${this.microservice}/recipes/${receiptId}/generate-invoice`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async getOptometryRecipeById(id) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/${id}`
    );
  }
}

export default OptometryService;