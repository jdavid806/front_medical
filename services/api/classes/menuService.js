import BaseApiService from "./baseApiService";

export class MenuService extends BaseApiService {
    async getAll() {
        return Promise.resolve([
            { name: 'Pacientes', key: 'pacientes' },
            { name: 'Citas', key: 'citas' },
            { name: 'Facturación', key: 'facturacion' },
            { name: 'Configuración', key: 'configuracion' },
            { name: 'Reportes', key: 'reportes' },
            { name: 'Seguridad', key: 'seguridad' },
        ]);
    }
}