// services/index.js
import BaseApiService from "./classes/baseApiService.js";
import OneToManyService from "./classes/oneToManyService.js";
import ManyToManyService from "./classes/manyToManyService.js";
import ManyToManyPolymorphicService from "./classes/manyToManyPolymorphicService.js";
import AuthService from "./classes/authService.js";
import { UserSpecialtyService } from "./classes/userSpecialtyService.js";
import { UserMockService } from "./classes/userMockService.js";
import { PatientMockService } from "./classes/patientMockService.js";
import { PatientService } from "./classes/patientService.js";
import { MenuService } from "./classes/menuService.js";
import { PermissionService } from "./classes/permissionService.js";
import { AdmissionService } from "./classes/admissionService.js";
import AppointmentService from "./classes/appointmentService.js";
import { CountrySeervice } from "./classes/countryService.js";
import { CityService } from "./classes/cityService.js";
import { ProductService } from "./classes/productService.js";
import { UserAvailabilityService } from "./classes/userAvailabilityService.js";
import { TemplateService } from "./classes/templateService.js";
import { CupsService } from "./classes/cupsService.js";
import { Cie11Service } from "./classes/cie11Service.js";
import { ExamenTypeService } from "./classes/examenTypeService.js";
import InventoryService from "./classes/inventoryServices.js";
import EstimateService from "./classes/estimateService.js";
import { PrescriptionService } from "./classes/prescriptionService.js";
import { TicketService } from "./classes/ticketService.js";
import FarmaciaService from "./classes/farmaciaService.js";
import { EvolutionNotesService } from "./classes/evolutionNotesService.js";
import { RemissionService } from "./classes/remissionService.js";
import { PaymentMethodService } from "./classes/paymentMethodService.js";
import { ClinicalRecordTypeService } from "./classes/clinicalRecordTypeService.js";
import { SuppliesService } from "./classes/suppliesService.js";
import DepartmentService from "./classes/departmentService.js";
import { PackagesService } from "./classes/packagesService.js";
import ClinicalRecordService from "./classes/clinicalRecordService.js";
import { UserService } from "./classes/userService.js";
import { UserRoleService } from "./classes/userRoleService.js";
import { HistoryPreadmissionService } from "./classes/historyPreadmissionService.js";
import { CashControlService } from "./classes/cashControlService.js";
import { CostCenterService } from "./classes/costCentersService.js";
import { BillingService } from "./classes/billingService.js";
import MSMasivaService from "./classes/msMasivaService.js";
import { ExamRecipeService } from "./classes/examRecipeService.js";
import ExamOrderService from "./classes/examOrderService.js";

export const authService = new AuthService("api/auth");

///////////// MEDICAL /////////////

// Para recursos API estándar
export const examCategoryService = new BaseApiService(
  "medical",
  "exam-categories"
);
export const examTypeService = new BaseApiService("medical", "exam-types");
export const examOrderService = new ExamOrderService("medical", "exam-orders");
export const examOrderStateService = new BaseApiService(
  "medical",
  "exam-order-states"
);
export const examPackageService = new BaseApiService("exam-packages");
export const examResultService = new BaseApiService("medical", "exam-results");

export const patientService = new PatientService("medical", "patients");
export const patientMockService = new PatientMockService("patients");

export const userService = new UserService("medical", "users");
export const userServiceMedical = new BaseApiService("medical");
export const userSpecialtyService = new UserSpecialtyService(
  "medical",
  "user-specialties"
);

// Para recursos anidados
export const admissionService = new AdmissionService("medical", "admissions");
export const appointmentService = new AppointmentService(
  "medical",
  "patients",
  "appointments"
);
export const appointmentStateService = new BaseApiService(
  "medical",
  "appointment-states"
);
export const appointmentTypeService = new BaseApiService(
  "medical",
  "appointment-types"
);
export const branchService = new BaseApiService("medical", "branches");

export const clinicalRecordService = new ClinicalRecordService(
  "medical",
  "patients",
  "clinical-records"
);
export const patientAdmissionService = new OneToManyService(
  "patients",
  "admissions"
);
export const patientDisabilityService = new OneToManyService(
  "medical",
  "patients",
  "disabilities"
);
export const patientNursingNoteService = new OneToManyService(
  "medical",
  "patients",
  "nursing-notes"
);
export const patientVaccineApplicationService = new OneToManyService(
  "patients",
  "vaccine-applications"
);
export const patientClinicalRecordsService = new OneToManyService(
  "patients",
  "clinical-records"
);
export const userAvailabilityService = new UserAvailabilityService(
  "medical",
  "users",
  "availabilities"
);

// Para grupos especiales
export const groupVaccinesService = new ManyToManyService("group-vaccines");
export const userRolePermissionService = new ManyToManyService(
  "user-role-permissions"
);
export const userRoleMenusService = new ManyToManyService("user-role-menus");
export const userSpecialtyMenusService = new ManyToManyService(
  "user-specialty-menus"
);
export const examPackageItemsService = new ManyToManyPolymorphicService(
  "exam-package-items"
);

export const menuService = new MenuService("");
export const permissionService = new PermissionService("");
export const ticketService = new TicketService("medical", "tickets");
export const moduleService = new BaseApiService("medical", "modules");

export const entityService = new BaseApiService("medical", "entities");
export const userRolesService = new UserRoleService("medical", "user-roles");
export const specializablesService = new BaseApiService(
  "medical",
  "specializables"
);

/* Countries */

export const countryService = new CountrySeervice("medical", "countries");

/* Departments */

export const departmentService = new DepartmentService(
  "medical",
  "countries",
  "departments"
);

/* Cities */

export const cityService = new CityService("medical", "departments", "cities");

/* Products */

export const productService = new ProductService(
  "medical",
  "products-services"
);

export const templateService = new ProductService("medical", "template-create");

/* Cups */

export const cupsService = new CupsService("medical", "cups");

/* Cie11 */

export const cie11Service = new Cie11Service("medical", "cie11");

/* ExamenType */

export const examenTypeService = new ExamenTypeService("medical", "exam-types");

/* Inventario */

export const inventoryService = new InventoryService("medical", "products-all");

/* Presupuestoss */
export const estimatesService = new EstimateService("medical");

/* evolution notes */

export const evolutionNotesService = new EvolutionNotesService("medical");

/* Remissions */

export const remissionService = new RemissionService("medical");

/* Prescripciones */
export const prescriptionService = new PrescriptionService(
  "medical",
  "recipes"
);

export const paymentMethodService = new PaymentMethodService(
  "medical",
  "payment-methods"
);
export const clinicalRecordTypeService = new ClinicalRecordTypeService(
  "medical"
);

/* Control de caja */

export const cashControlService = new CashControlService(
  "api/v1/admin",
  "cash-closures"
);

/* Entrega de Medicamentos e Insumos */
export const suppliesService = new SuppliesService("api/v1/admin");
export const farmaciaService = new FarmaciaService("medical");

export const packagesService = new PackagesService("api/v1/admin");
export const historyPreadmission = new HistoryPreadmissionService(
  "medical",
  "history-preadmissions"
);

export const costCenterService = new CostCenterService();

export const billingService = new BillingService();

export const msMasivaService = new MSMasivaService('api/mensajeria', '');

export const examRecipeService = new ExamRecipeService('medical', 'exam-recipes');