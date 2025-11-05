import UserManager from "../../userManager";
import BaseApiService from "./baseApiService";
import { userService } from "../index.js";
import { getJWTPayload } from "../../utilidades.js";

export class PatientService extends BaseApiService {
  async getByUser() {
    const res = await super.getAll();
    const user = await userService.getByExternalId(getJWTPayload().sub);
    const today = new Date().toISOString().split("T")[0];

    try {
      if (user.role.group === "DOCTOR") {
        const filteredPatients = res.map((patient) => {
          return {
            ...patient,
            fullName: `${patient.first_name} ${patient.middle_name} ${patient.last_name} ${patient.second_last_name}`,
            appointments: patient.appointments.filter(
              (appointment) =>
                appointment.user_availability.user_id === user.id &&
                appointment.appointment_date === today
            ),
          };
        });

        return filteredPatients;
      }
      const resFilter = res.map((patient) => {
        return {
          ...patient,
          fullName: `${patient.first_name} ${patient.middle_name} ${patient.last_name} ${patient.second_last_name}`,
        };
      });
      return resFilter;
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
      throw error;
    }
  }

  async getByUserAndFilter({ per_page = 8, page = 1 }) {
    return await this.httpClient.get(
      `medical/v2/patients/${getJWTPayload().sub}`,
      {
        per_page,
        page,
      }
    );
  }

  async getWithAppointmentsByUserAndFilter({ per_page = 8, page = 1 }) {
    return await this.httpClient.get(
      `medical/v2/patients-with-appointments/${getJWTPayload().sub}`,
      {
        per_page,
        page,
      }
    );
  }

  async getByFilters({ search, per_page = 10, page = 1 }) {
    return await this.httpClient.get(`medical/v2/patients-clinical-records`, {
      per_page,
      page,
      search,
    });
  }

  async get(id) {
    const res = await super.get(id);
    try {
      const user = await userService.getByExternalId(getJWTPayload().sub);
      const permissions = user.role.permissions.map(
        (permission) => permission.key
      );

      if (!permissions.includes("patients_view_sensitive")) {
        res.validated_data = {
          email: "*".repeat(8),
          whatsapp: "*".repeat(8),
        };
      } else {
        res.validated_data = {
          email: res.email,
          whatsapp: res.whatsapp,
        };
      }
    } catch (error) {
      res.validated_data = {
        email: res.email,
        whatsapp: res.whatsapp,
      };
    }

    return res;
  }

  async evolution(id) {
    return await this.httpClient.get(
      this.microservice + "/" + this.endpoint + "/evolution/" + id
    );
  }

  async storePatient(data) {
    return await this.httpClient.post(
      this.microservice + "/" + "patients-companion-social-security",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async updatePatient(id, data) {
    return await this.httpClient.put(
      this.microservice + "/" + "patients-companion-social-security" + "/" + id,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async findByField({ field, value }) {
    return await this.httpClient.post(
      this.microservice + "/" + this.endpoint + "/find-by/field",
      {
        field,
        value,
      }
    );
  }

  async getLastDisability(patientId) {
    return await this.httpClient.get(
      "medical/patients-disabilities/last-by-patient/" + patientId
    );
  }

  async getWithFilters(data) {
    return await this.httpClient.post(
      this.microservice + "/patients/withFilters",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
