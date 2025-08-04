import { exportToExcel as originalExportToExcel } from "../../accounting/utils/ExportToExcelOptions";

// Interfaces
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

export interface BillingReportData {
  billing_user: string;
  billed_procedure?: {
    product: {
      name: string;
    };
    amount: string;
  }[];
  insurance?: {
    name: string;
  };
  payment_methods?: {
    payment_method: {
      method: string;
    };
    amount: string;
  }[];
}

// Wrapper function para exportToExcel
export const exportToExcel = async <T extends any[]>(params: ExportToExcelParams<T>) => {
  const { excelConfig, ...restParams } = params;
  
  // Transformar a formato compatible con la función original
  const compatibleParams = {
    ...restParams,
    ...(excelConfig?.sheetName && { sheetName: excelConfig.sheetName }),
    ...(excelConfig?.columnWidths && { columnWidths: excelConfig.columnWidths })
  };

  await originalExportToExcel(compatibleParams);
};

// Función para exportar procedimientos
export const exportProceduresToExcel = async (reportData: BillingReportData[]) => {
  if (!reportData || reportData.length === 0) {
    throw new Error("No hay datos para exportar");
  }

  const users = [...new Set(reportData.map((item) => item.billing_user))];
  const procedures = [
    ...new Set(
      reportData.flatMap(
        (item) => item.billed_procedure?.map((p) => p.product.name) || []
      )
    ),
  ];

  // Preparar los datos para Excel
  const excelData = procedures.map((proc) => {
    const row: any = { Procedimiento: proc };
    users.forEach((user) => {
      row[user] = reportData
        .filter((item) => item.billing_user === user)
        .flatMap((item) => item.billed_procedure || [])
        .filter((p) => p?.product.name === proc)
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    });
    return row;
  });

  // Añadir fila de totales
  const totalsRow: any = { Procedimiento: "Total" };
  users.forEach((user) => {
    totalsRow[user] = excelData.reduce((sum, row) => sum + (row[user] || 0), 0);
  });
  excelData.push(totalsRow);

  // Configurar parámetros de exportación
  await exportToExcel({
    data: excelData,
    fileName: "Reporte_Procedimientos",
    columns: [
      { field: "Procedimiento", header: "Procedimiento" },
      ...users.map((user) => ({
        field: user,
        header: user,
      })),
    ],
    excelConfig: {
      sheetName: "Procedimientos",
      columnWidths: [
        { wch: 30 }, // Procedimiento
        ...users.map(() => ({ wch: 20 })), // Columnas de usuarios
      ],
    },
  });
};

// Función para exportar entidades
export const exportEntitiesToExcel = async (reportData: BillingReportData[]) => {
  if (!reportData || reportData.length === 0) {
    throw new Error("No hay datos para exportar");
  }

  const filteredData = reportData.filter((item) => item.insurance);
  const entities = new Set<string>();
  const billingUsers = new Set<string>();
  const groupedData: Record<string, Record<string, number>> = {};
  const totals: Record<string, number> = {};

  filteredData.forEach((entry) => {
    const { billing_user, insurance, billed_procedure } = entry;
    const insuranceName = insurance?.name || "";

    entities.add(insuranceName);
    billingUsers.add(billing_user);

    if (!groupedData[insuranceName]) {
      groupedData[insuranceName] = {};
    }

    if (!groupedData[insuranceName][billing_user]) {
      groupedData[insuranceName][billing_user] = 0;
    }

    if (!totals[billing_user]) {
      totals[billing_user] = 0;
    }

    billed_procedure?.forEach((proc) => {
      const amount = parseFloat(proc.amount);
      groupedData[insuranceName][billing_user] += amount;
      totals[billing_user] += amount;
    });
  });

  // Preparar datos para Excel
  const excelData = Array.from(entities).map((entity) => {
    const row: any = { Entidad: entity };
    Array.from(billingUsers).forEach((user) => {
      row[user] = groupedData[entity][user]?.toFixed(2) || "0.00";
    });
    return row;
  });

  // Añadir fila de totales
  const totalsRow: any = { Entidad: "Total" };
  Array.from(billingUsers).forEach((user) => {
    totalsRow[user] = totals[user]?.toFixed(2) || "0.00";
  });
  excelData.push(totalsRow);

  // Configurar parámetros de exportación
  await exportToExcel({
    data: excelData,
    fileName: "Reporte_Entidades",
    columns: [
      { field: "Entidad", header: "Entidad" },
      ...Array.from(billingUsers).map((user) => ({
        field: user,
        header: user,
      })),
    ],
    excelConfig: {
      sheetName: "Entidades",
      columnWidths: [
        { wch: 30 }, // Entidad
        ...Array.from(billingUsers).map(() => ({ wch: 20 })), // Columnas de usuarios
      ],
    },
  });
};

// Función para exportar métodos de pago
export const exportPaymentsToExcel = async (reportData: BillingReportData[]) => {
  if (!reportData || reportData.length === 0) {
    throw new Error("No hay datos para exportar");
  }

  const paymentMethods = new Set<string>();
  const billingUsers = new Set<string>();
  const groupedData: Record<string, Record<string, number>> = {};
  const totals: Record<string, number> = {};

  reportData.forEach((entry) => {
    const { billing_user, payment_methods } = entry;
    billingUsers.add(billing_user);

    payment_methods?.forEach((pm) => {
      const method = pm.payment_method.method;
      const amount = parseFloat(pm.amount);

      paymentMethods.add(method);

      if (!groupedData[method]) {
        groupedData[method] = {};
      }

      if (!groupedData[method][billing_user]) {
        groupedData[method][billing_user] = 0;
      }

      if (!totals[billing_user]) {
        totals[billing_user] = 0;
      }

      groupedData[method][billing_user] += amount;
      totals[billing_user] += amount;
    });
  });

  // Preparar datos para Excel
  const excelData = Array.from(paymentMethods).map((method) => {
    const row: any = { "Método de Pago": method };
    Array.from(billingUsers).forEach((user) => {
      row[user] = groupedData[method][user]?.toFixed(2) || "0.00";
    });
    return row;
  });

  // Añadir fila de totales
  const totalsRow: any = { "Método de Pago": "Total" };
  Array.from(billingUsers).forEach((user) => {
    totalsRow[user] = totals[user]?.toFixed(2) || "0.00";
  });
  excelData.push(totalsRow);

  // Configurar parámetros de exportación
  await exportToExcel({
    data: excelData,
    fileName: "Reporte_Metodos_Pago",
    columns: [
      { field: "Método de Pago", header: "Método de Pago" },
      ...Array.from(billingUsers).map((user) => ({
        field: user,
        header: user,
      })),
    ],
    excelConfig: {
      sheetName: "Métodos de Pago",
      columnWidths: [
        { wch: 25 }, // Método de Pago
        ...Array.from(billingUsers).map(() => ({ wch: 20 })), // Columnas de usuarios
      ],
    },
  });
};