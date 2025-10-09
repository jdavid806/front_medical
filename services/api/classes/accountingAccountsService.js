import BaseApiService from "./baseApiService.js";

export class AccountingAccountsService extends BaseApiService {
    async getAllAccounts() {
        return await this.httpClient.get(`${this.microservice}/accounting-accounts?per_page=all`);
    }

    async getAccountById(accountId) {
        return await this.httpClient.get(
            `${this.microservice}/accounting-accounts/${accountId}`
        );
    }

    async createAccount(data) {
        return await this.httpClient.post(
            `${this.microservice}/accounting-accounts`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    async updateAccount(accountId, data) {
        return await this.httpClient.put(
            `${this.microservice}/accounting-accounts/${accountId}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }


    async getAccountByCode(accountCode) {
        return await this.httpClient.get(
            `${this.microservice}/accounting-accounts/code/${accountCode}`
        );
    }
    async getAccountByCategory(category, value) {
        return this.httpClient.get(`api/v1/admin/accounting-accounts/by-column?column=${category}&value=${value}`);

    }

    async getAccountingAccountsTree() {
        return await this.httpClient.get(`${this.microservice}/accounting-accounts/list/tree`);
    }

    async getAccountingAccountWithColumneUnique(column){
         return await this.httpClient.get(`${this.microservice}/accounting-accounts/column-unique/${column}`);
    }
}

export default AccountingAccountsService;