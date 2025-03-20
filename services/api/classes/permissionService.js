import BaseApiService from "./baseApiService";

export class PermissionService extends BaseApiService {
    async getAll() {
        return Promise.resolve([
            {
                name: 'Gestión de pacientes',
                key_: 'patients_management',
                permissions: [
                    { name: 'Ver pacientes', key_: 'patients_view' },
                    { name: 'Crear pacientes', key_: 'patients_create' },
                    { name: 'Editar pacientes', key_: 'patients_edit' },
                    { name: 'Eliminar pacientes', key_: 'patients_delete' },
                    { name: 'Ver información sensible de pacientes', key_: 'patients_view_sensitive' },
                ]
            },
            {
                name: 'Gestión de citas',
                key_: 'appointments_management',
                permissions: [
                    { name: 'Ver citas', key_: 'appointments_view' },
                    { name: 'Crear citas', key_: 'appointments_create' },
                    { name: 'Editar citas', key_: 'appointments_edit' },
                    { name: 'Eliminar citas', key_: 'appointments_delete' },
                ]
            },
            {
                name: 'Gestión de facturas',
                key_: 'invoices_management',
                permissions: [
                    { name: 'Ver facturas', key_: 'invoices_view' },
                    { name: 'Crear facturas', key_: 'invoices_create' },
                    { name: 'Editar facturas', key_: 'invoices_edit' },
                    { name: 'Eliminar facturas', key_: 'invoices_delete' },
                ]
            },
            {
                name: 'Gestión de configuración',
                key_: 'settings_management',
                permissions: [
                    { name: 'Editar configuración', key_: 'settings_edit' },
                ]
            },
            {
                name: 'Gestión de reportes',
                key_: 'reports_management',
                permissions: [
                    { name: 'Ver reportes', key_: 'reports_view' },
                ]
            },
            {
                name: 'Gestión de seguridad',
                key_: 'security_management',
                permissions: [
                    { name: 'Editar seguridad', key_: 'security_edit' },
                ]
            },
            {
                name: 'Gestión de usuarios',
                key_: 'users_management',
                permissions: [
                    { name: 'Ver usuarios', key_: 'users_view' },
                    { name: 'Crear usuarios', key_: 'users_create' },
                    { name: 'Editar usuarios', key_: 'users_edit' },
                    { name: 'Eliminar usuarios', key_: 'users_delete' },
                ]
            },
            {
                name: 'Gestión de roles',
                key_: 'roles_management',
                permissions: [
                    { name: 'Ver roles', key_: 'roles_view' },
                    { name: 'Crear roles', key_: 'roles_create' },
                    { name: 'Editar roles', key_: 'roles_edit' },
                    { name: 'Eliminar roles', key_: 'roles_delete' },
                ]
            },
        ]);
    }
}