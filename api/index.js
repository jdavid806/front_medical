// services/index.js
import BaseApiService from './classes/baseApiService'
import OneToManyService from './classes/oneToManyService';
import ManyToManyService from './classes/manyToManyService';
import ManyToManyPolymorphicService from './classes/manyToManyPolymorphicService';

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
export const patientAdmissionService = new OneToManyService('patients', 'admissions');
export const patientDisabilityService = new OneToManyService('patients', 'disabilities');
export const patientNursingNoteService = new OneToManyService('patients', 'nursing-notes');
export const patientVaccineApplicationService = new OneToManyService('patients', 'vaccine-applications');
export const patientClinicalRecordsService = new OneToManyService('patients', 'clinical-records');

// Para grupos especiales
export const groupVaccinesService = new ManyToManyService('group-vaccines');
export const userRolePermissionService = new ManyToManyService('user-role-permissions');
export const userRoleMenusService = new ManyToManyService('user-role-menus');
export const userSpecialtyMenusService = new ManyToManyService('user-specialty-menus');
export const examPackageItemsService = new ManyToManyPolymorphicService('exam-package-items');