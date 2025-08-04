import { exportToExcel as originalExportToExcel } from "../../accounting/utils/ExportToExcelOptions";

export interface ExcelExportConfig {
    sheetName: string;
    columnWidths: { wch: number }[];
}

export interface ExportToExcelParams<T extends any[]> {
    data: T;
    fileName: string;
    columns?: {
        field: string;
        header: string;
    }[];
    dt?: React.RefObject<any>;
    selectionOnly?: boolean;
    excludeColumns?: string[];
    excelConfig?: ExcelExportConfig;
}

export interface ExportButtonProps {
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
}

export interface SpecialistReportData {
    billing_doctor: string;
    billed_procedure?: {
        product: {
            name: string;
        };
        amount: string;
    }[];
    insurance?: {
        name: string;
    };
    appointment_date_time?: {
        date: string;
    };
}

// Wrapper function para exportToExcel
export const exportToExcel = async <T extends any[]>(params: ExportToExcelParams<T>) => {
    const { excelConfig, ...restParams } = params;

    const compatibleParams = {
        ...restParams,
        ...(excelConfig?.sheetName && { sheetName: excelConfig.sheetName }),
        ...(excelConfig?.columnWidths && { columnWidths: excelConfig.columnWidths })
    };

    await originalExportToExcel(compatibleParams);
};

// Función para exportar procedimientos por especialista
export const exportDoctorsProceduresToExcel = async (reportData: SpecialistReportData[]) => {
    if (!reportData || reportData.length === 0) {
        throw new Error("No hay datos para exportar");
    }

    // Procesar datos para Excel
    const doctors = new Set<string>();
    const procedures = new Set<string>();
    const procedureDoctorTotals: Record<string, Record<string, number>> = {};

    reportData.forEach((entry) => {
        const doctor = entry.billing_doctor;
        doctors.add(doctor);

        entry.billed_procedure?.forEach((proc) => {
            const procedureName = proc.product?.name;
            const amount = parseFloat(proc.amount) || 0;

            procedures.add(procedureName);

            if (!procedureDoctorTotals[procedureName]) {
                procedureDoctorTotals[procedureName] = {};
            }

            procedureDoctorTotals[procedureName][doctor] =
                (procedureDoctorTotals[procedureName][doctor] || 0) + amount;
        });
    });

    // Calcular totales
    const doctorTotals: Record<string, number> = {};
    Array.from(doctors).forEach((doctor: string) => {
        doctorTotals[doctor] = Array.from(procedures).reduce((sum, proc: string) => {
            return sum + (procedureDoctorTotals[proc]?.[doctor] || 0);
        }, 0);
    });

    // Preparar datos para Excel
    const excelData = Array.from(procedures).map((proc: string) => {
        const row: Record<string, any> = { Procedimiento: proc };
        Array.from(doctors).forEach((doctor: string) => {
            row[doctor] = procedureDoctorTotals[proc]?.[doctor] || 0;
        });
        // Agregar columna de total
        row['Total'] = Array.from(doctors).reduce((sum, doctor: string) => {
            return sum + (procedureDoctorTotals[proc]?.[doctor] || 0);
        }, 0);
        return row;
    });

    // Agregar fila de totales
    const totalsRow: Record<string, any> = { Procedimiento: "Total" };
    Array.from(doctors).forEach((doctor: string) => {
        totalsRow[doctor] = doctorTotals[doctor] || 0;
    });
    totalsRow['Total'] = Array.from(doctors).reduce((sum, doctor: string) => {
        return sum + (doctorTotals[doctor] || 0);
    }, 0);
    excelData.push(totalsRow);

    await exportToExcel({
        data: excelData,
        fileName: "Reporte_Procedimientos_Especialistas",
        columns: [
            { field: "Procedimiento", header: "Procedimiento" },
            ...Array.from(doctors).map((doctor: string) => ({
                field: doctor,
                header: doctor,
            })),
            { field: "Total", header: "Total" }
        ],
        excelConfig: {
            sheetName: "Procedimientos",
            columnWidths: [
                { wch: 30 },
                ...Array.from(doctors).map(() => ({ wch: 20 })),
                { wch: 20 }
            ],
        },
    });
};

// Función para exportar precios por entidad
export const exportEntityPricesToExcel = async (reportData: SpecialistReportData[]) => {
    if (!reportData || reportData.length === 0 || !reportData.some(item => item.insurance)) {
        throw new Error("No hay datos de entidades para exportar");
    }

    const filteredData = reportData.filter((item) => item.insurance);
    const doctors = new Set<string>();
    const entities = new Set<string>();
    const doctorEntityTotals: Record<string, Record<string, number>> = {};

    filteredData.forEach((entry) => {
        const doctor = entry.billing_doctor;
        const entity = entry.insurance?.name;
        let total = 0; // Define total here

        if (entry.billed_procedure) {
            total = entry.billed_procedure.reduce(
                (sum: number, proc: any) => sum + parseFloat(proc.amount || 0),
                0
            );
        }

        if (entity && doctor) {
            doctors.add(doctor);
            entities.add(entity);

            if (!doctorEntityTotals[doctor]) {
                doctorEntityTotals[doctor] = {};
            }

            doctorEntityTotals[doctor][entity] =
                (doctorEntityTotals[doctor][entity] || 0) + total;
        }
    });

    // Calcular totales
    const entityTotals: Record<string, number> = {};
    Array.from(entities).forEach((entity: string) => {
        entityTotals[entity] = Array.from(doctors).reduce((sum, doctor: string) => {
            return sum + (doctorEntityTotals[doctor]?.[entity] || 0);
        }, 0);
    });

    // Preparar datos para Excel
    const excelData = Array.from(doctors).map((doctor: string) => {
        const row: Record<string, any> = { Médico: doctor };
        Array.from(entities).forEach((entity: string) => {
            row[entity] = doctorEntityTotals[doctor]?.[entity] || 0;
        });
        // Agregar columna de total
        row['Total'] = Array.from(entities).reduce((sum, entity: string) => {
            return sum + (doctorEntityTotals[doctor]?.[entity] || 0);
        }, 0);
        return row;
    });

    // Agregar fila de totales
    const totalsRow: Record<string, any> = { Médico: "Total" };
    Array.from(entities).forEach((entity: string) => {
        totalsRow[entity] = entityTotals[entity] || 0;
    });
    totalsRow['Total'] = Array.from(entities).reduce((sum, entity: string) => {
        return sum + (entityTotals[entity] || 0);
    }, 0);
    excelData.push(totalsRow);

    await exportToExcel({
        data: excelData,
        fileName: "Reporte_Precios_Entidades",
        columns: [
            { field: "Médico", header: "Médico" },
            ...Array.from(entities).map((entity: string) => ({
                field: entity,
                header: entity,
            })),
            { field: "Total", header: "Total" }
        ],
        excelConfig: {
            sheetName: "Precios por Entidad",
            columnWidths: [
                { wch: 30 },
                ...Array.from(entities).map(() => ({ wch: 20 })),
                { wch: 20 }
            ],
        },
    });
};

// Función para exportar conteo por entidad
export const exportEntityCountsToExcel = async (reportData: SpecialistReportData[]) => {
    if (!reportData || reportData.length === 0 || !reportData.some(item => item.insurance)) {
        throw new Error("No hay datos de entidades para exportar");
    }

    const filteredData = reportData.filter((item) => item.insurance);
    const doctors = new Set<string>();
    const entities = new Set<string>();
    const entityDoctorCounts: Record<string, Record<string, number>> = {};

    filteredData.forEach((entry) => {
        const entity = entry.insurance?.name;
        const doctor = entry.billing_doctor;
        const procedureCount = entry.billed_procedure?.length || 0;

        if (entity && doctor) {
            entities.add(entity);
            doctors.add(doctor);

            if (!entityDoctorCounts[entity]) {
                entityDoctorCounts[entity] = {};
            }

            entityDoctorCounts[entity][doctor] =
                (entityDoctorCounts[entity][doctor] || 0) + procedureCount;
        }
    });

    // Calcular totales
    const doctorTotals: Record<string, number> = {};
    Array.from(doctors).forEach((doctor: string) => {
        doctorTotals[doctor] = Array.from(entities).reduce((sum, entity: string) => {
            return sum + (entityDoctorCounts[entity]?.[doctor] || 0);
        }, 0);
    });

    // Preparar datos para Excel
    const excelData = Array.from(entities).map((entity: string) => {
        const row: Record<string, any> = { Entidad: entity };
        Array.from(doctors).forEach((doctor: string) => {
            row[doctor] = entityDoctorCounts[entity]?.[doctor] || 0;
        });
        // Agregar columna de total
        row['Total'] = Array.from(doctors).reduce((sum, doctor: string) => {
            return sum + (entityDoctorCounts[entity]?.[doctor] || 0);
        }, 0);
        return row;
    });

    // Agregar fila de totales
    const totalsRow: Record<string, any> = { Entidad: "Total" };
    Array.from(doctors).forEach((doctor: string) => {
        totalsRow[doctor] = doctorTotals[doctor] || 0;
    });
    totalsRow['Total'] = Array.from(doctors).reduce((sum, doctor: string) => {
        return sum + (doctorTotals[doctor] || 0);
    }, 0);
    excelData.push(totalsRow);

    await exportToExcel({
        data: excelData,
        fileName: "Reporte_Conteo_Entidades",
        columns: [
            { field: "Entidad", header: "Entidad" },
            ...Array.from(doctors).map((doctor: string) => ({
                field: doctor,
                header: doctor,
            })),
            { field: "Total", header: "Total" }
        ],
        excelConfig: {
            sheetName: "Conteo por Entidad",
            columnWidths: [
                { wch: 30 },
                ...Array.from(doctors).map(() => ({ wch: 20 })),
                { wch: 20 }
            ],
        },
    });
};

// Función para exportar consultas por fecha
export const exportConsultationsToExcel = async (reportData: SpecialistReportData[]) => {
    if (!reportData || reportData.length === 0) {
        throw new Error("No hay datos de consultas para exportar");
    }

    const doctors = new Set<string>();
    const dates = new Set<string>();
    const doctorDateCounts: Record<string, Record<string, number>> = {};

    reportData.forEach((entry) => {
        const doctor = entry.billing_doctor;
        const date = entry.appointment_date_time?.date;

        if (doctor && date) {
            doctors.add(doctor);
            dates.add(date);

            if (!doctorDateCounts[doctor]) {
                doctorDateCounts[doctor] = {};
            }

            doctorDateCounts[doctor][date] = (doctorDateCounts[doctor][date] || 0) + 1;
        }
    });

    // Ordenar fechas
    const sortedDates = Array.from(dates).sort();

    // Calcular totales por fecha
    const dateTotals: Record<string, number> = {};
    sortedDates.forEach((date: string) => {
        dateTotals[date] = Array.from(doctors).reduce((sum, doctor: string) => {
            return sum + (doctorDateCounts[doctor]?.[date] || 0);
        }, 0);
    });

    // Preparar datos para Excel
    const excelData = Array.from(doctors).map((doctor: string) => {
        const row: Record<string, any> = { Profesional: doctor };
        sortedDates.forEach((date: string) => {
            row[date] = doctorDateCounts[doctor]?.[date] || 0;
        });
        // Agregar columna de total
        row['Total'] = sortedDates.reduce((sum, date: string) => {
            return sum + (doctorDateCounts[doctor]?.[date] || 0);
        }, 0);
        return row;
    });

    // Agregar fila de totales
    const totalsRow: Record<string, any> = { Profesional: "Total" };
    sortedDates.forEach((date: string) => {
        totalsRow[date] = dateTotals[date] || 0;
    });
    totalsRow['Total'] = sortedDates.reduce((sum, date: string) => {
        return sum + (dateTotals[date] || 0);
    }, 0);
    excelData.push(totalsRow);

    await exportToExcel({
        data: excelData,
        fileName: "Reporte_Consultas",
        columns: [
            { field: "Profesional", header: "Profesional" },
            ...sortedDates.map((date: string) => ({
                field: date,
                header: date,
            })),
            { field: "Total", header: "Total" }
        ],
        excelConfig: {
            sheetName: "Consultas por Fecha",
            columnWidths: [
                { wch: 25 },
                ...sortedDates.map(() => ({ wch: 15 })),
                { wch: 15 }
            ],
        },
    });
};