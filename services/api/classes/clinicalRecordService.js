import OneToManyService from "./oneToManyService.js";

export class ClinicalRecordService extends OneToManyService {
  async clinicalRecordsParamsStore(patientId, data) {
    return await this.httpClient.post(
      `${this.microservice}/clinical-records-params/${patientId}`,
      data
    );
  }

  async lastByPatient(patientId) {
    return await this.httpClient.get(
      `medical/clinical-records/last-by-patient/${patientId}`
    );
  }

  async getParaclinicalByAppointment(appointmentId) {
    return await this.httpClient.get(
      `medical/clinical-records/get-paraclinical-by-appointment/${appointmentId}`
    );
  }

  async filterClinicalRecords({ per_page, page, search, hasLatestPendingCancellationRequest = null, patientId = null, forCurrentUserRole = null }) {
    return await this.httpClient.get(`medical/clinical-records/query/filter`, {
      per_page,
      page,
      search,
      hasLatestPendingCancellationRequest,
      patientId,
      forCurrentUserRole
    });
  }
}

export default ClinicalRecordService;
