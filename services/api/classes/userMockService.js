import BaseApiService from "./baseApiService";

export class UserMockService extends BaseApiService {
    getAll() {
        return [
            {
                "id": 1,
                "first_name": "Carlos",
                "middle_name": "Luis",
                "last_name": "Garcia",
                "second_last_name": "Garcia",
                "external_id": "1",
                "user_role_id": 8,
                "user_specialty_id": 1,
                "is_active": true,
                "created_at": "2025-02-13T19:16:14.000000Z",
                "updated_at": "2025-02-13T19:16:14.000000Z"
            },
            {
                "id": 2,
                "first_name": "Sandra",
                "middle_name": "Marcela",
                "last_name": "Garcia",
                "second_last_name": "Garcia",
                "external_id": "2",
                "user_role_id": 9,
                "user_specialty_id": 3,
                "is_active": true,
                "created_at": "2025-02-13T19:16:14.000000Z",
                "updated_at": "2025-02-13T19:16:14.000000Z"
            }
        ]
    }
}
