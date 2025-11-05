import BaseApiService from "./baseApiService";

export class ProductCategoryService extends BaseApiService {
    async getProductCategories() {
        return await this.httpClient.get("api/v1/admin/category-products");
    }
}

export default ProductCategoryService;
