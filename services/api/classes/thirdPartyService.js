import BaseApiService from "./baseApiService";

export class ThirdPartyService extends BaseApiService {
    constructor() {
        super("api/v1/admin", "third-parties");
    }

    async getByExternalIdAndType({ externalId, externalType }) {
        return await this.httpClient.get(
            `api/v1/admin/third-parties/external/${externalId}/${externalType}`
        );
    }

    async verifyAndStore(data) {
        return await this.httpClient.post(
            `api/v1/admin/third-parties/verify/store`,
            data
        );
    }

    async getByFilters({ search, per_page = 10, page = 1 }) {
        return await this.httpClient.get(`api/v1/admin/third-parties/query/filter`, {
            per_page,
            page,
            search
        });
    }
}
