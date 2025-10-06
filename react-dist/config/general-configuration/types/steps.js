import { EmpresaConfig } from "../components/EmpresaConfig.js";
import { ContabilidadConfig } from "../components/ContabilidadConfig.js";
import { EspecialidadesConfig } from "../components/EspecialidadesConfig.js";
import { UsersConfig } from "../components/UsersConfig.js";
import { HorariosConfig } from "../components/HorariosConfig.js";
import { PreciosConfig } from "../components/PreciosConfig.js";
import { RolesConfig } from "../components/RolesConfig.js";
export const configurationSteps = [{
  id: 'empresa',
  label: 'Configuración de Empresa',
  icon: 'fas fa-city',
  component: EmpresaConfig
}, {
  id: 'contabilidad',
  label: 'Configuración de Contabilidad',
  icon: 'fas fa-calculator',
  component: ContabilidadConfig
}, {
  id: 'especialidades',
  label: 'Especialidades Médicas',
  icon: 'fas fa-heart',
  component: EspecialidadesConfig
}, {
  id: 'roles',
  label: 'Creación de Roles',
  icon: 'fas fa-user',
  component: RolesConfig
}, {
  id: 'usuarios',
  label: 'Creación de Usuarios',
  icon: 'fas fa-users',
  component: UsersConfig
}, {
  id: 'horarios',
  label: 'Configuración Horarios',
  icon: 'fas fa-clock',
  component: HorariosConfig
}, {
  id: 'precios',
  label: 'Precios',
  icon: 'fas fa-dollar-sign',
  component: PreciosConfig
}];