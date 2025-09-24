import { cleanJsonObject } from "../../utilidades.js";
import OneToManyService from "./oneToManyService.js";

export class AppointmentService extends OneToManyService {
  async updateAppointmentStatus(taskId, status) {
    try {
      const url = `${this.microservice}/${this.childEndpoint}/${taskId}`;
      return await this.httpClient.patch(url, { appointment_state_id: status });
    } catch (error) {
      console.error(
        `Error getting ${this.childEndpoint} for parent ${parentId}:`,
        error
      );
      throw error;
    }
  }

  async changeStatus(id, statusKey) {
    try {
      return await this.httpClient.post(
        `${this.microservice}/change-status-appointment/${id}/${statusKey}`
      );
    } catch (error) {
      console.error(
        `Error getting ${this.childEndpoint} for parent ${parentId}:`,
        error
      );
      throw error;
    }
  }

  async getLastByPatient(patientId) {
    return await this.httpClient.get(
      `${this.microservice}/appointments/last-by-patient/${patientId}`
    );
  }

  async bulkCreate(data, patientId) {
    return await this.httpClient.post(
      `${this.microservice}/${this.parentEndpoint}/${patientId}/${this.childEndpoint}/bulk`,
      data
    );
  }

  async bulkValidate(data, patientId) {
    return await this.httpClient.post(
      `${this.microservice}/${this.parentEndpoint}/${patientId}/${this.childEndpoint}/validate-bulk`,
      data
    );
  }

  async appointmentsWithFilters(data) {
    return await this.httpClient.post(
      `${this.microservice}/appointments/with-filters`,
      data
    );
  }

  async admissionByAppointmentSimplify(appointmentId) {
    return await this.httpClient.get(
      `${this.microservice}/admissions/simplified/${appointmentId}`
    );
  }

  async filterAppointments(data) {
    return await this.httpClient.get(
      `${this.microservice}/v2/appointments`,
      cleanJsonObject(data)
    );
  }

    async getProductsToBeInvoiced(appointmentId) {
    return await this.httpClient.get(
      `medical/appointments/products/to-be-invoiced/${appointmentId}`
    );
  }

  async reportByScheduler(data) {
    return await this.httpClient.post(
      `medical/appointments/report-by-scheduler`,
      data
    );
  }
}

export default AppointmentService;
