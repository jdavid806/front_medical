import BaseApiService from "./baseApiService";

export class MenuService extends BaseApiService {
    async getAll() {
        return Promise.resolve([
            { name: 'Pacientes', key_: 'pacientes', route:'pacientes' },
            { name: 'Pacientes | Consultas', key_: 'pacientes_consultas', route:'consultas-especialidad' },
            { name: 'Pacientes | Ordenes Medicas', key_: 'pacientes_notas_ordenes_medicas', route:'verExamenes' },
            { name: 'Pacientes | Recetas', key_: 'pacientes_recetas', route:'verRecetas' },
            { name: 'Pacientes | Incapacidades', key_: 'pacientes_incapacidades', route:'verIncapacidades' },
            { name: 'Pacientes | Antecedentes', key_: 'pacientes_antecendetes', route:'verAntecedentes' },
            { name: 'Pacientes | Consentimientos', key_: 'pacientes_consentimientos', route:'verConcentimientos'},
            { name: 'Pacientes | Presupuestos', key_: 'pacientes_presupuestos', route:'registros-presupuestos' },
            { name: 'Pacientes | Notas Enfermeria', key_: 'pacientes_notas_enfermeria', route:'enfermeria' },
            { name: 'Pacientes | Evoluciones', key_: 'pacientes_evoluciones', route:'evoluciones' },
            { name: 'Pacientes | Remisiones', key_: 'pacientes_remisiones', route:'remisiones' },
            { name: 'Citas', key_: 'citas', route: 'citasControl' },
            { name: 'Facturación', key_: 'facturacion', route: 'FE_FCE' },
            { name: 'Configuración', key_: 'configuracion', route: 'FE_Config'},
            { name: 'Reportes', key_: 'reportes', route:'Menu_reports' },
            { name: 'Seguridad', key_: 'seguridad' },
            { name: 'Inventarios', key_: 'inventarios', route:'homeInventario' },
            { name: 'Marketing', key_: 'marketing', route:'homeMarketing' },
            { name: 'Turnos', key_: 'turnos', route:'homeMarketing' },
            { name: 'Farmacia', key_: 'farmacia', route:'homeFarmacia' },
            { name: 'Contabilidad', key_: 'contabilidad' },
            { name: 'Nomina', key_: 'nomina' },
            { name: 'Auditoria', key_: 'auditoria' },
            { name: 'Hospitalización y Cirugia', key_: 'hospitalizacion' }
        ]);
    }
}