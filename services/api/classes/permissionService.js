import BaseApiService from "./baseApiService";

export class PermissionService extends BaseApiService {
    async getAll() {
        return Promise.resolve([
            {
                name: 'Gestión de pacientes',
                key: 'patients_management',
                permissions: [
                    { name: 'Ver pacientes', key: 'patients_view' },
                    { name: 'Crear pacientes', key: 'patients_create' },
                    { name: 'Editar pacientes', key: 'patients_edit' },
                    { name: 'Eliminar pacientes', key: 'patients_delete' },
                ]
            },
            {
                name: 'Gestión de citas',
                key: 'appointments_management',
                permissions: [
                    { name: 'Ver citas', key: 'appointments_view' },
                    { name: 'Crear citas', key: 'appointments_create' },
                    { name: 'Editar citas', key: 'appointments_edit' },
                    { name: 'Eliminar citas', key: 'appointments_delete' },
                ]
            },
            {
                name: 'Gestión de facturas',
                key: 'invoices_management',
                permissions: [
                    { name: 'Ver facturas', key: 'invoices_view' },
                    { name: 'Crear facturas', key: 'invoices_create' },
                    { name: 'Editar facturas', key: 'invoices_edit' },
                    { name: 'Eliminar facturas', key: 'invoices_delete' },
                ]
            },
            {
                name: 'Gestión de configuración',
                key: 'settings_management',
                permissions: [
                    { name: 'Editar configuración', key: 'settings_edit' },
                ]
            },
            {
                name: 'Gestión de reportes',
                key: 'reports_management',
                permissions: [
                    { name: 'Ver reportes', key: 'reports_view' },
                ]
            },
            {
                name: 'Gestión de seguridad',
                key: 'security_management',
                permissions: [
                    { name: 'Editar seguridad', key: 'security_edit' },
                ]
            },
            {
                name: 'Gestión de usuarios',
                key: 'users_management',
                permissions: [
                    { name: 'Ver usuarios', key: 'users_view' },
                    { name: 'Crear usuarios', key: 'users_create' },
                    { name: 'Editar usuarios', key: 'users_edit' },
                    { name: 'Eliminar usuarios', key: 'users_delete' },
                ]
            },
            {
                name: 'Gestión de roles',
                key: 'roles_management',
                permissions: [
                    { name: 'Ver roles', key: 'roles_view' },
                    { name: 'Crear roles', key: 'roles_create' },
                    { name: 'Editar roles', key: 'roles_edit' },
                    { name: 'Eliminar roles', key: 'roles_delete' },
                ]
            },
        ]);
    }
}