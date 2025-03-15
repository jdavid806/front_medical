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
            { name: 'Inventarios', key_: 'inventarios' },
            { name: 'Marketing', key_: 'marketing' },
            { name: 'Turnos', key_: 'turnos' },
            { name: 'Farmacia', key_: 'farmacia' },
            { name: 'Inteligencia Artificial', key_: 'ia' },
            { name: 'Contabilidad', key_: 'contabilidad' },
            { name: 'Nomina', key_: 'nomina' },
            { name: 'Auditoria', key_: 'auditoria' },
            { name: 'Hospitalización y Cirugia', key_: 'hospitalizacion' }
        ]);
    }
}