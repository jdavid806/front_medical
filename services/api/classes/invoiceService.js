import BaseApiService from "./baseApiService";

export class InvoiceService extends BaseApiService {
    constructor() {
        super("api/v1/admin", "invoices");
    }

    async storeSale(data) {
        return await this.httpClient.post(`api/v1/admin/invoices/sales`, data);
    }

    async filterInvoices({ per_page, page, type, invoiceCode, createdAt, thirdParty, status, subType, sort }) {
        return await this.httpClient.post(`api/v1/admin/invoices/query/filter`, {
            per_page,
            page,
            type,
            invoiceCode,
            createdAt,
            thirdParty,
            status,
            subType,
            sort
        });
    }

    async getPurcharseInvoiceById(id) {
        return await this.httpClient.get(`api/v1/admin/invoices/purchases${id}`);
    }

    async getAllPurcharseInvoice() {
        return await this.httpClient.get(`api/v1/admin/invoices/purchases`);
    }

    async storePurcharseInvoice(data) {
        return await this.httpClient.post(
            `api/v1/admin/invoices/purchases`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
    async getInvoicesByTypeAndStatus(type, status) {
        try {
            const url = `/api/v1/admin/invoices/filter-by-type-status?type=${type}&status=${status}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Error en la petición');
            return await response.json();
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw error;
        }
    }

    async filterInvoice(data) {
        return await this.httpClient.post(`api/v1/admin/invoices/query/filter`, data);
    }



    async getTogenerateNotes() {
        return await this.httpClient.get(`api/v1/admin/invoices/generate-notes`);
    }

    async createCreditNote(data) {
        return await this.httpClient.post(`api/v1/admin/notes/credit `, data);
    }

    async createDebitNote(data) {
        return await this.httpClient.post(`api/v1/admin/notes/debit `, data);
    }

    async getNotes() {
        return await this.httpClient.get(`api/v1/admin/notes`);
    }

    async applyNote(payload) {
        console.log(payload);
        return await this.httpClient.post(`api/v1/admin/buy-invoices/apply-note`, payload);
    }
}
