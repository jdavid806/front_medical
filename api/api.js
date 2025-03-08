// services/index.js
import { BaseApiService, NestedApiService, RouteGroupService } from './classes';

// Para recursos API estándar
export const appointmentService = new BaseApiService('appointments');
export const examCategoryService = new BaseApiService('exam-categories');
export const examTypeService = new BaseApiService('exam-types');
export const examOrderService = new BaseApiService('exam-orders');
export const examOrderStateService = new BaseApiService('exam-order-states');
export const examPackageService = new BaseApiService('exam-packages');
export const examResultService = new BaseApiService('exam-results');
export const patientService = new BaseApiService('patients');

// Para recursos anidados
export const patientAdmissionService = new NestedApiService('patients', 'admissions');
export const patientDisabilityService = new NestedApiService('patients', 'disabilities');
export const patientNursingNoteService = new NestedApiService('patients', 'nursing-notes');
export const patientVaccineApplicationService = new NestedApiService('patients', 'vaccine-applications');
export const patientClinicalRecordsService = new NestedApiService('patients', 'clinical-records');

// Para grupos especiales
export const groupVaccinesService = new RouteGroupService('group-vaccines');
export const userRolePermissionService = new RouteGroupService('user-role-permissions');
export const examPackageItemsService = new RouteGroupService('exam-package-items');