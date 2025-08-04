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
}
