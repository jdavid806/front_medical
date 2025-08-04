import BaseApiService from "./baseApiService.js";

export class CashRecipes extends BaseApiService {
    async getAllCashRecipes() {
        return await this.httpClient.get(`${this.microservice}/cash-receipts`);
    }

    async getCashRecipeById(cashId) {
        return await this.httpClient.get(
            `${this.microservice}/cash-receipts/${cashId}`
        );
    }

    async createCashRecipe(data) {
        return await this.httpClient.post(
            `${this.microservice}/cash-receipts`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    async updateCashRecipe(cashRecipeID, data) {
        return await this.httpClient.put(
            `${this.microservice}/accounting-accounts/${cashRecipeID}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    async createCashRecipeWhithInvoice(data) {
        return await this.httpClient.post(
            `${this.microservice}/cash-receipts`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    async getAdvancePaymentsOfPurchaseOrder(purchaseOrderId) {
        return await this.httpClient.get(
            `${this.microservice}/cash-receipts/purchase-order/${purchaseOrderId}/advance-payments`
        );
    }

    // async deleteAccount(accountId) {
    //     return await this.httpClient.delete(
    //         `${this.microservice}/accounting-accounts/${accountId}`
    //     );
    // }

    // async getAccountByCode(accountCode) {
    //     return await this.httpClient.get(
    //         `${this.microservice}/accounting-accounts/code/${accountCode}`
    //     );
    // }
}

export default CashRecipes;