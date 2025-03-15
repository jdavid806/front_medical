import BaseApiService from "./baseApiService";

export class MenuService extends BaseApiService {
    async getAll() {
        return Promise.resolve([
            { name: 'Pacientes', key_: 'pacientes' },
            { name: 'Pacientes | Evolución del paciente', key_: 'pacientes_evolucion_paciente' },
            { name: 'Pacientes | Consultas', key_: 'pacientes_consultas' },
            { name: 'Pacientes | Consultas | IA', key_: 'pacientes_consultas' },
            { name: 'Pacientes | Ordenes Medicas', key_: 'pacientes_notas_ordenes_medicas' },
            { name: 'Pacientes | Recetas', key_: 'pacientes_recetas' },
            { name: 'Pacientes | Incapacidades', key_: 'pacientes_incapacidades' },
            { name: 'Pacientes | Antecedentes', key_: 'pacientes_antecendetes' },
            { name: 'Pacientes | Consentimientos', key_: 'pacientes_consentimientos' },
            { name: 'Pacientes | Presupuestos', key_: 'pacientes_presupuestos' },
            { name: 'Pacientes | Notas Enfermeria', key_: 'pacientes_notas_enfermeria' },
            { name: 'Pacientes | Evoluciones', key_: 'pacientes_evoluciones' },
            { name: 'Pacientes | Remisiones', key_: 'pacientes_remisiones' },
            { name: 'Pacientes | Info Paciente', key_: 'pacientes_info_paciente' },
            { name: 'Pacientes | Info Paciente | Ver Tel y Correo', key_: 'pacientes_info_paciente_datos_sensibles' },
            { name: 'Citas', key_: 'citas' },
            { name: 'Citas | Admisiones', key_: 'citas_admisiones' },
            { name: 'Citas | Citas', key_: 'citas_citas' },
            { name: 'Citas | Citas de Espera', key_: 'citas_sala_de_espera' },
            { name: 'Facturación', key_: 'facturacion' },
            { name: 'Configuración', key_: 'configuracion' },
            { name: 'Reportes', key_: 'reportes' },
            { name: 'Seguridad', key_: 'seguridad' },
        ]);
    }
}