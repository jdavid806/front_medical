import BaseApiService from "./baseApiService";

export class ProductTypeService extends BaseApiService {
    constructor() {
        super("api/v1/admin", "product-types");
    }
}
