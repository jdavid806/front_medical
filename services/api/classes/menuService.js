import BaseApiService from "./baseApiService";

export class MenuService extends BaseApiService {
    async getAll() {
        return Promise.resolve([
            { name: 'Consultas', key_: 'pacientes', route: 'pacientes' },
            { name: 'Consultas | Consultas', key_: 'pacientes_consultas', route: 'consultas-especialidad' },
            { name: 'Consultas | Ordenes Medicas', key_: 'pacientes_notas_ordenes_medicas', route: 'verExamenes' },
            { name: 'Consultas | Recetas', key_: 'pacientes_recetas', route: 'verRecetas' },
            { name: 'Consultas | Incapacidades', key_: 'pacientes_incapacidades', route: 'verIncapacidades' },
            { name: 'Consultas | Antecedentes', key_: 'pacientes_antecendetes', route: 'verAntecedentes' },
            { name: 'Consultas | Consentimientos', key_: 'pacientes_consentimientos', route: 'verConcentimientos' },
            { name: 'Consultas | Presupuestos', key_: 'pacientes_presupuestos', route: 'registros-presupuestos' },
            { name: 'Consultas | Notas Enfermeria', key_: 'pacientes_notas_enfermeria', route: 'enfermeria' },
            { name: 'Consultas | Evoluciones', key_: 'pacientes_evoluciones', route: 'evoluciones' },
            { name: 'Consultas | Remisiones', key_: 'pacientes_remisiones', route: 'remisiones' },
            { name: 'Citas', key_: 'citas', route: 'citasControl' },
            { name: 'Citas | Facturacion', key_: 'citas_facturacion', route: 'facturacionAdmisiones' },
            { name: 'Citas | Citas', key_: 'citas_citas', route: 'gestioncitas' },
            { name: 'Citas | Pacientes', key_: 'citas_pacientes', route: 'pacientescontrol' },
            { name: 'Citas | Admisiones', key_: 'citas_admisiones', route: 'controlAdmisiones' },
            { name: 'Citas | Gestion', key_: 'citas_gestion', route: 'gestioncitas' },
            { name: 'Citas | Sala de Espera', key_: 'citas_sala_de_espera', route: 'salaEspera' },
            { name: 'Facturación', key_: 'facturacion', route: 'FE_FCE' },
            { name: 'Configuración', key_: 'configuracion', route: 'FE_Config' },
            { name: 'Reportes', key_: 'reportes', route: 'Menu_reports' },
            { name: 'Seguridad', key_: 'seguridad' },
            { name: 'Inventarios', key_: 'inventarios', route: 'homeInventario' },
            { name: 'Marketing', key_: 'marketing', route: 'homeMarketing' },
            { name: 'Turnos', key_: 'turnos', route: 'homeTurnos' },
            { name: 'Farmacia', key_: 'farmacia', route: 'homeFarmacia' },
            { name: 'Contabilidad', key_: 'contabilidad' },
            { name: 'Nomina', key_: 'nomina' },
            { name: 'Auditoria', key_: 'auditoria', route: 'homeAuditoria' },
            { name: 'Auditoria | Anulaciones', key_: 'auditoria_anulaciones', route: 'consultas-anulacion-pendiente' },
            { name: 'Auditoria | Control Caja', key_: 'auditoria_control_caja', route: 'controlCaja' },
            { name: 'Auditoria | Reporte Caja ', key_: 'auditoria_reporte_caja', route: 'reporteCaja' },
        ]);
    }
}