import BaseApiService from "./baseApiService.js";

export class AccountingClosingsService extends BaseApiService {
    constructor() {
        super("api/v1/admin", "fiscal-periods");
    }
}

export default AccountingClosingsService;