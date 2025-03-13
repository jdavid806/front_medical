import BaseApiService from "./baseApiService";

export class MenuService extends BaseApiService {
    async getAll() {
        return Promise.resolve([
            { name: 'Pacientes', key_: 'pacientes' },
            { name: 'Citas', key_: 'citas' },
            { name: 'Facturación', key_: 'facturacion' },
            { name: 'Configuración', key_: 'configuracion' },
            { name: 'Reportes', key_: 'reportes' },
            { name: 'Seguridad', key_: 'seguridad' },
        ]);
    }
}