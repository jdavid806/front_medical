import OneToManyService from "./oneToManyService.js";

export class ClinicalRecordService extends OneToManyService {
  async clinicalRecordsParamsStore(patientId, data) {
    return await this.httpClient.post(
      `${this.microservice}/clinical-records-params/${patientId}`,
      data
    );
  }

  async clinicalRecordsParamsStoreFromApprovedReview(patientId, data) {
    return await this.httpClient.post(
      `${this.microservice}/clinical-records-params-from-approved-review/${patientId}`,
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

  async filterClinicalRecords({ per_page, page, search, hasLatestPendingCancellationRequest = null, hasLatestPendingReviewRequest = null, patientId = null, forCurrentUserRole = null }) {
    return await this.httpClient.get(`medical/clinical-records/query/filter`, {
      per_page,
      page,
      search,
      hasLatestPendingCancellationRequest,
      hasLatestPendingReviewRequest,
      patientId,
      forCurrentUserRole
    });
  }

  async reportToAverage(filters) {
    return await this.httpClient.post(`medical/clinical-records/report-to-average`, filters);
  }

  async reportOfDiagnosis(filters) {
    return await this.httpClient.post(`medical/clinical-records/report-of-diagnosis`, filters);
  }

  async reportOfDiagnosisPatientsGrouped(filters) {
    return await this.httpClient.post(`medical/clinical-records/report-of-diagnosis-patients-grouped`, filters);
  }
}

export default ClinicalRecordService;
