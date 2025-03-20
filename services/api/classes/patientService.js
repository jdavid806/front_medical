import UserManager from "../../userManager";
import BaseApiService from "./baseApiService";
import { userService } from "../index.js";
import { getJWTPayload } from "../../utilidades.js";

export class PatientService extends BaseApiService {

  async getByUser() {
    const res = await super.getAll();
    const user = await userService.getByExternalId(getJWTPayload().sub);

    try {
      if (user.role.group === "DOCTOR") {
        const filteredPatients = res.map((patient) => {
          return {
            ...patient,
            appointments: patient.appointments.filter(
              (appointment) =>
                appointment.user_availability.user_id === user.id
            ),
          };
        }).filter((patient) => patient.appointments.length > 0);

        return filteredPatients;
      }
      return res;
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
      throw error;
    }
  }

  async get(id) {
    const res = await super.get(id);
    const user = await userService.getByExternalId(getJWTPayload().sub);

    const permissions = user.role.permissions.map((permission) => permission.key);

    if (!permissions.includes("patients_view_sensitive")) {
      res.validated_data = {
        email: "*".repeat(8),
        whatsapp: "*".repeat(8),
      };
    } else {
      res.validated_data = {
        email: patient.email,
        whatsapp: patient.whatsapp,
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

  async findByField({ field, value }) {
    return await this.httpClient.post(
      this.microservice + "/" + this.endpoint + "/find-by/field",
      {
        field,
        value,
      }
    );
  }
}
