import BaseApiService from "./baseApiService";

export class TicketService extends BaseApiService {
    async getAllByReasons(reasons) {
        return await this.httpClient.post(`${this.microservice}/${this.endpoint}/by-reasons`, {
            reasons
        })
    }

    async lastByPatient(patientId){
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/last-by-patient/${patientId}`)
    }

    async getTicketsToday() {
        return await this.httpClient.get('medical/tickets/today')
    }

    async getAllTicketReasons() {
        return await this.httpClient.get('medical/ticket-reasons')
    }

    async getTicketReason(id) {
        return await this.httpClient.get(`medical/ticket-reasons/${id}`)
    }

    async createTicketReason(data) {
        return await this.httpClient.post('medical/ticket-reasons', data)
    }

    async updateTicketReason(id, data) {
        return await this.httpClient.put(`medical/ticket-reasons/${id}`, data)
    }

    async deleteTicketReason(id) {
        return await this.httpClient.delete(`medical/ticket-reasons/${id}`)
    }

    async getAllTicketPriorities() {
        return await this.httpClient.get('medical/ticket-priorities')
    }
}
