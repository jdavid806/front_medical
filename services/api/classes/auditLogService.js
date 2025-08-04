import { cleanJsonObject } from "../../utilidades.js";
import BaseApiService from "./baseApiService.js";

export class AuditLogService extends BaseApiService {

    constructor() {
        super("medical", "audit-logs");
    }

    async getPaginated(data) {
        return await this.httpClient.get(
            `${this.microservice}/${this.endpoint}`,
            cleanJsonObject(data)
        );
    }

    async getPaginatedForAdmin(data) {
        return await this.httpClient.get(
            `api/v1/admin/${this.endpoint}`,
            cleanJsonObject(data)
        );
    }
}

export default AuditLogService;