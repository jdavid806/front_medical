import BaseApiService from "./baseApiService.js";

export class InventoryService extends BaseApiService {
  async getAll() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
  }

  async getById(id) {
    return await this.httpClient.get(`api/v1/admin/products/${id}`);
  }
  async storeProduct(data) {
    return await this.httpClient.post(
      `${this.microservice}/product-create`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async createMedication(data) {
    return await this.httpClient.post(
      `api/v1/admin/products/medicamentos`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async deleteProduct(id) {
    return await this.httpClient.delete(`api/v1/admin/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async updateProduct(id, data) {
    return await this.httpClient.put(`api/v1/admin/products/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
    });
  }



  // Métodos para creación de productos
  async createSupply(data) {
    return await this.httpClient.post(
      `api/v1/admin/products/insumos`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async createMedication(data) {
    return await this.httpClient.post(
      `api/v1/admin/products/medicamentos`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async createVaccine(data) {
    return await this.httpClient.post(
      `api/v1/admin/products/vacunas`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async createActivoFijo(data) {
    return await this.httpClient.post(
      `api/v1/admin/products/activos-fijos`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async createInventariable(data) {
    return await this.httpClient.post(
      `api/v1/admin/products/inventariables`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async getSupplies() {
    return await this.httpClient.get(`api/v1/admin/products/insumos`);
  }

  async getMedications() {
    return await this.httpClient.get(`api/v1/admin/products/medicamentos`);
  }

  async getVaccines() {
    return await this.httpClient.get(`api/v1/admin/products/vacunas`);
  }

  async getServices() {
    return await this.httpClient.get(`api/v1/admin/products/servicios`);
  }

  async getActivosFijos() {
    return await this.httpClient.get(`api/v1/admin/products/activos-fijos`);
  }

  async getInventariables() {
    return await this.httpClient.get(`api/v1/admin/products/inventariables`);
  }

  async getDepositsInventories({ productType }) {
    return await this.httpClient.get(`api/v1/admin/deposits/get-inventories-of-product-type/${productType}`);
  }

  async getDepositsInventoriesOnlyDeposits({ productType }) {
    return await this.httpClient.get(`api/v1/admin/deposits/get-inventories-of-product-type-only-deposits/${productType}`);
  }

  async usersSuppliesStockReport() {
    return await this.httpClient.get(`medical/users/supplies/stock/report`);
  }
}
export default InventoryService;
