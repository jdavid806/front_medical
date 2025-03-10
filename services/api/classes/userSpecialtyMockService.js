import BaseApiService from "./baseApiService";

export class UserSpecialtyMockService extends BaseApiService {
    getAll() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        "id": 1,
                        "name": "Cardiología",
                        "is_active": true,
                        "created_at": "2025-02-13T19:16:14.000000Z",
                        "updated_at": "2025-02-13T19:16:14.000000Z"
                    },
                    {
                        "id": 2,
                        "name": "Pediatría",
                        "is_active": true,
                        "created_at": "2025-02-13T19:16:14.000000Z",
                        "updated_at": "2025-02-13T19:16:14.000000Z"
                    },
                    {
                        "id": 3,
                        "name": "Neurología",
                        "is_active": true,
                        "created_at": "2025-02-13T19:16:14.000000Z",
                        "updated_at": "2025-02-13T19:16:14.000000Z"
                    },
                    {
                        "id": 4,
                        "name": "Dermatología",
                        "is_active": true,
                        "created_at": "2025-02-13T19:16:14.000000Z",
                        "updated_at": "2025-02-13T19:16:14.000000Z"
                    },
                    {
                        "id": 5,
                        "name": "Ginecología",
                        "is_active": true,
                        "created_at": "2025-02-13T19:16:14.000000Z",
                        "updated_at": "2025-02-13T19:16:14.000000Z"
                    },
                    {
                        "id": 6,
                        "name": "Oncología",
                        "is_active": true,
                        "created_at": "2025-02-13T19:16:14.000000Z",
                        "updated_at": "2025-02-13T19:16:14.000000Z"
                    },
                    {
                        "id": 7,
                        "name": "Oftalmología",
                        "is_active": true,
                        "created_at": "2025-02-13T19:16:14.000000Z",
                        "updated_at": "2025-02-13T19:16:14.000000Z"
                    },
                    {
                        "id": 8,
                        "name": "Psiquiatría",
                        "is_active": true,
                        "created_at": "2025-02-13T19:16:14.000000Z",
                        "updated_at": "2025-02-13T19:16:14.000000Z"
                    }
                ])
            }, 500);
        });
    }
}
