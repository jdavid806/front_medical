import OneToManyService from './oneToManyService.js';

export class AppointmentMockService extends OneToManyService {
    async getAll() {
        return Promise.resolve([
            {
                "id": 1,
                "assigned_user_availability_id": 4,
                "created_by_user_id": 1,
                "patient_id": 1,
                "appointment_state_id": 1,
                "appointment_time": "14:10:00",
                "appointment_date": "2025-02-14",
                "attention_type": "CONSULTATION",
                "consultation_purpose": "PREVENTION",
                "consultation_type": "CONTROL",
                "external_cause": "ACCIDENT",
                "is_active": true,
                "created_at": "2025-02-13T19:17:46.000000Z",
                "updated_at": "2025-02-13T19:17:46.000000Z",
                "patient": {
                    "id": 1,
                    "document_type": "CC",
                    "document_number": "470179895298842",
                    "first_name": "Brian",
                    "middle_name": "Niko",
                    "last_name": "Schmidt",
                    "second_last_name": "West",
                    "gender": "FEMALE",
                    "date_of_birth": "1951-12-17",
                    "address": "25648 Aufderhar Spurs Apt. 013\nNorth Meaghanside, ME 64878",
                    "nationality": "Mali",
                    "is_donor": false,
                    "blood_type": "AB_POSITIVE",
                    "has_special_condition": false,
                    "special_condition": "Molestiae accusantium exercitationem deleniti sed qui.",
                    "has_allergies": false,
                    "allergies": "Quia animi facere voluptatem et nemo enim ipsam.",
                    "has_surgeries": false,
                    "surgeries": null,
                    "has_medical_history": false,
                    "medical_history": "Quia quas repudiandae non magnam ea quibusdam.",
                    "eps": "Funk Ltd",
                    "afp": null,
                    "arl": null,
                    "affiliate_type": "Cotizante",
                    "branch_office": "Lake Spencer",
                    "is_active": true,
                    "created_at": "2025-02-13T19:16:14.000000Z",
                    "updated_at": "2025-02-13T19:16:14.000000Z",
                    "country_id": 1,
                    "department_id": 1,
                    "city_id": 1,
                    "whatsapp": "(423) 807-6618",
                    "email": "randal.von@labadie.com",
                    "regime_id": null
                },
                "user_availability": {
                    "id": 4,
                    "user_id": 2,
                    "appointment_type_id": 1,
                    "branch_id": 3,
                    "appointment_duration": 20,
                    "days_of_week": "[0,1,3]",
                    "start_time": "10:17:00",
                    "end_time": "18:50:00",
                    "is_active": true,
                    "created_at": "2025-02-13T19:16:14.000000Z",
                    "updated_at": "2025-02-13T19:16:14.000000Z",
                    "user": {
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
                }
            },
            {
                "id": 2,
                "assigned_user_availability_id": 4,
                "created_by_user_id": 1,
                "patient_id": 1,
                "appointment_state_id": 1,
                "appointment_time": "14:10:00",
                "appointment_date": "2025-02-15",
                "attention_type": "CONSULTATION",
                "consultation_purpose": "PREVENTION",
                "consultation_type": "CONTROL",
                "external_cause": "ACCIDENT",
                "is_active": true,
                "created_at": "2025-02-13T19:18:40.000000Z",
                "updated_at": "2025-02-13T19:18:40.000000Z",
                "patient": {
                    "id": 1,
                    "document_type": "CC",
                    "document_number": "470179895298842",
                    "first_name": "Brian",
                    "middle_name": "Niko",
                    "last_name": "Schmidt",
                    "second_last_name": "West",
                    "gender": "FEMALE",
                    "date_of_birth": "1951-12-17",
                    "address": "25648 Aufderhar Spurs Apt. 013\nNorth Meaghanside, ME 64878",
                    "nationality": "Mali",
                    "is_donor": false,
                    "blood_type": "AB_POSITIVE",
                    "has_special_condition": false,
                    "special_condition": "Molestiae accusantium exercitationem deleniti sed qui.",
                    "has_allergies": false,
                    "allergies": "Quia animi facere voluptatem et nemo enim ipsam.",
                    "has_surgeries": false,
                    "surgeries": null,
                    "has_medical_history": false,
                    "medical_history": "Quia quas repudiandae non magnam ea quibusdam.",
                    "eps": "Funk Ltd",
                    "afp": null,
                    "arl": null,
                    "affiliate_type": "Cotizante",
                    "branch_office": "Lake Spencer",
                    "is_active": true,
                    "created_at": "2025-02-13T19:16:14.000000Z",
                    "updated_at": "2025-02-13T19:16:14.000000Z",
                    "country_id": 1,
                    "department_id": 1,
                    "city_id": 1,
                    "whatsapp": "(423) 807-6618",
                    "email": "randal.von@labadie.com",
                    "regime_id": null
                },
                "user_availability": {
                    "id": 4,
                    "user_id": 2,
                    "appointment_type_id": 1,
                    "branch_id": 3,
                    "appointment_duration": 20,
                    "days_of_week": "[0,1,3]",
                    "start_time": "10:17:00",
                    "end_time": "18:50:00",
                    "is_active": true,
                    "created_at": "2025-02-13T19:16:14.000000Z",
                    "updated_at": "2025-02-13T19:16:14.000000Z",
                    "user": {
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
                }
            },
            {
                "id": 3,
                "assigned_user_availability_id": 4,
                "created_by_user_id": 1,
                "patient_id": 1,
                "appointment_state_id": 1,
                "appointment_time": "14:10:00",
                "appointment_date": "2025-02-16",
                "attention_type": "CONSULTATION",
                "consultation_purpose": "PREVENTION",
                "consultation_type": "CONTROL",
                "external_cause": "ACCIDENT",
                "is_active": true,
                "created_at": "2025-02-13T19:18:43.000000Z",
                "updated_at": "2025-02-13T19:18:43.000000Z",
                "patient": {
                    "id": 1,
                    "document_type": "CC",
                    "document_number": "470179895298842",
                    "first_name": "Brian",
                    "middle_name": "Niko",
                    "last_name": "Schmidt",
                    "second_last_name": "West",
                    "gender": "FEMALE",
                    "date_of_birth": "1951-12-17",
                    "address": "25648 Aufderhar Spurs Apt. 013\nNorth Meaghanside, ME 64878",
                    "nationality": "Mali",
                    "is_donor": false,
                    "blood_type": "AB_POSITIVE",
                    "has_special_condition": false,
                    "special_condition": "Molestiae accusantium exercitationem deleniti sed qui.",
                    "has_allergies": false,
                    "allergies": "Quia animi facere voluptatem et nemo enim ipsam.",
                    "has_surgeries": false,
                    "surgeries": null,
                    "has_medical_history": false,
                    "medical_history": "Quia quas repudiandae non magnam ea quibusdam.",
                    "eps": "Funk Ltd",
                    "afp": null,
                    "arl": null,
                    "affiliate_type": "Cotizante",
                    "branch_office": "Lake Spencer",
                    "is_active": true,
                    "created_at": "2025-02-13T19:16:14.000000Z",
                    "updated_at": "2025-02-13T19:16:14.000000Z",
                    "country_id": 1,
                    "department_id": 1,
                    "city_id": 1,
                    "whatsapp": "(423) 807-6618",
                    "email": "randal.von@labadie.com",
                    "regime_id": null
                },
                "user_availability": {
                    "id": 4,
                    "user_id": 2,
                    "appointment_type_id": 1,
                    "branch_id": 3,
                    "appointment_duration": 20,
                    "days_of_week": "[0,1,3]",
                    "start_time": "10:17:00",
                    "end_time": "18:50:00",
                    "is_active": true,
                    "created_at": "2025-02-13T19:16:14.000000Z",
                    "updated_at": "2025-02-13T19:16:14.000000Z",
                    "user": {
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
                }
            }
        ]);
    }

    async activeCount() {
        const appointments = await this.getAll()
        return Promise.resolve(appointments.filter(appointment => appointment.is_active).length);
    }
}

export default AppointmentMockService;