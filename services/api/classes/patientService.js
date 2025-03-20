import UserManager from "../../userManager";
import BaseApiService from "./baseApiService";

export class PatientService extends BaseApiService {

    async get(id) {
        const res = await super.get(id);

        UserManager.onAuthChange(async (isAuthenticated, user, userPermissions, userMenus) => {
            if (userPermissions) {
                const permissions = userPermissions.map(permission => permission.key);

                if (!permissions.includes('patients_view_sensitive')) {
                    res.validated_data = {
                        email: "*".repeat(8),
                        whatsapp: "*".repeat(8)
                    }
                } else {
                    res.validated_data = {
                        email: patient.email,
                        whatsapp: patient.whatsapp
                    }
                }
            }
        })

        return res;
    }

    async evolution(id) {
        return await this.httpClient.get(this.microservice + "/" + this.endpoint + '/evolution/' + id);
    }

    async storePatient(data) {
        return await this.httpClient.post(this.microservice + "/" + 'patients-companion-social-security', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async findByField({ field, value }) {
        return await this.httpClient.post(this.microservice + "/" + this.endpoint + '/find-by/field', {
            field,
            value
        });
    }
}
