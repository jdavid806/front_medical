import BaseApiService from "./baseApiService.js";

export class BillingReportService extends BaseApiService {
    async getBalanceGeneral({ from, to }) {
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);

        return await this.httpClient.get(`api/v1/admin/balance-general?${params.toString()}`);
    }

    async getComparativeBalanceGeneral({ from1, to1, from2, to2 }) {

        if (!from1 || !to1 || !from2 || !to2) {
            throw new Error("Los parámetros 'from1', 'to1', 'from2' y 'to2' son obligatorios.");
        }

        const params = new URLSearchParams();
        params.append('from1', from1);
        params.append('to1', to1);
        params.append('from2', from2);
        params.append('to2', to2);

        return await this.httpClient.get(`api/v1/admin/balance-general/compare?${params.toString()}`);
    }

    async getStatusResult({ from, to }) {
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        return await this.httpClient.get(`api/v1/admin/income-statement?${params.toString()}`);
    }

    async getComparativeStatusResult({ from1, to1, from2, to2 }) {
        const params = new URLSearchParams();
        params.append('from1', from1);
        params.append('to1', to1);
        params.append('from2', from2);
        params.append('to2', to2);
        return await this.httpClient.get(`api/v1/admin/income-statement/compare?${params.toString()}`);
    }

    async getGeneralJournal({ from, to }) {
        const params = new URLSearchParams();
        if (from) params.append('desde', from);
        if (to) params.append('hasta', to);
        return await this.httpClient.get(`api/v1/admin/libro-diario?${params.toString()}`);
    }

    async getAccountingEntries() {
        return await this.httpClient.get(`api/v1/admin/general-ledger-entries`);
    }
}

export default BillingReportService;
