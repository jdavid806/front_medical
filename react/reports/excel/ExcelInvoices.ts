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
  options?: any;
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
  
  const compatibleParams = {
    ...restParams,
    ...(excelConfig?.sheetName && { sheetName: excelConfig.sheetName }),
    ...(excelConfig?.columnWidths && { columnWidths: excelConfig.columnWidths })
  };

  await originalExportToExcel(compatibleParams);
};

// Función para exportar procedimientos (corregida)
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

  const excelData = procedures.map((proc) => {
    const row: any = { Procedimiento: proc };
    let rowTotal = 0;
    
    users.forEach((user) => {
      const amount = reportData
        .filter((item) => item.billing_user === user)
        .flatMap((item) => item.billed_procedure || [])
        .filter((p) => p?.product.name === proc)
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      row[user] = amount;
      rowTotal += amount;
    });
    
    row['Total'] = rowTotal;
    return row;
  });

  const totalsRow: any = { Procedimiento: "Total" };
  let grandTotal = 0;
  
  users.forEach((user) => {
    totalsRow[user] = excelData.reduce((sum, row) => sum + (row[user] || 0), 0);
    grandTotal += totalsRow[user];
  });
  
  totalsRow['Total'] = grandTotal;
  excelData.push(totalsRow);

  await exportToExcel({
    data: excelData,
    fileName: "Reporte_Procedimientos",
    columns: [
      { field: "Procedimiento", header: "Procedimiento" },
      ...users.map((user) => ({
        field: user,
        header: user,
      })),
      { field: "Total", header: "Total" }
    ],
    excelConfig: {
      sheetName: "Procedimientos",
      columnWidths: [
        { wch: 30 },
        ...users.map(() => ({ wch: 20 })),
        { wch: 20 }
      ],
    },
  });
};

// Función para exportar entidades (corregida)
export const exportEntitiesToExcel = async (reportData: BillingReportData[]) => {
  if (!reportData || reportData.length === 0) {
    throw new Error("No hay datos para exportar");
  }

  const filteredData = reportData.filter((item) => item.insurance);
  if (filteredData.length === 0) {
    throw new Error("No hay datos de entidades para exportar");
  }

  const entities = new Set<string>();
  const billingUsers = new Set<string>();
  const groupedData: Record<string, Record<string, number>> = {};
  const totals: Record<string, number> = {};

  filteredData.forEach((entry) => {
    const { billing_user, insurance, billed_procedure } = entry;
    const insuranceName = insurance?.name || "Sin nombre";

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
      const amount = parseFloat(proc.amount) || 0;
      groupedData[insuranceName][billing_user] += amount;
      totals[billing_user] += amount;
    });
  });

  const excelData = Array.from(entities).map((entity) => {
    const row: any = { Entidad: entity };
    let rowTotal = 0;
    
    Array.from(billingUsers).forEach((user) => {
      const amount = (groupedData[entity]?.[user] || 0);
      row[user] = amount.toFixed(2);
      rowTotal += amount;
    });
    
    row['Total'] = rowTotal.toFixed(2);
    return row;
  });

  const totalsRow: any = { Entidad: "Total" };
  let grandTotal = 0;
  
  Array.from(billingUsers).forEach((user) => {
    totalsRow[user] = (totals[user] || 0).toFixed(2);
    grandTotal += totals[user] || 0;
  });
  
  totalsRow['Total'] = grandTotal.toFixed(2);
  excelData.push(totalsRow);

  await exportToExcel({
    data: excelData,
    fileName: "Reporte_Entidades",
    columns: [
      { field: "Entidad", header: "Entidad" },
      ...Array.from(billingUsers).map((user) => ({
        field: user,
        header: user,
      })),
      { field: "Total", header: "Total" }
    ],
    excelConfig: {
      sheetName: "Entidades",
      columnWidths: [
        { wch: 30 },
        ...Array.from(billingUsers).map(() => ({ wch: 20 })),
        { wch: 20 }
      ],
    },
  });
};

// Función para exportar métodos de pago (corregida)
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
    if (!payment_methods || payment_methods.length === 0) return;

    billingUsers.add(billing_user);

    payment_methods.forEach((pm) => {
      const method = pm.payment_method?.method || "Sin método";
      const amount = parseFloat(pm.amount) || 0;

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

  if (paymentMethods.size === 0) {
    throw new Error("No hay métodos de pago para exportar");
  }

  const excelData = Array.from(paymentMethods).map((method) => {
    const row: any = { "Método de Pago": method };
    let rowTotal = 0;
    
    Array.from(billingUsers).forEach((user) => {
      const amount = (groupedData[method]?.[user] || 0);
      row[user] = amount.toFixed(2);
      rowTotal += amount;
    });
    
    row['Total'] = rowTotal.toFixed(2);
    return row;
  });

  const totalsRow: any = { "Método de Pago": "Total" };
  let grandTotal = 0;
  
  Array.from(billingUsers).forEach((user) => {
    totalsRow[user] = (totals[user] || 0).toFixed(2);
    grandTotal += totals[user] || 0;
  });
  
  totalsRow['Total'] = grandTotal.toFixed(2);
  excelData.push(totalsRow);

  await exportToExcel({
    data: excelData,
    fileName: "Reporte_Metodos_Pago",
    columns: [
      { field: "Método de Pago", header: "Método de Pago" },
      ...Array.from(billingUsers).map((user) => ({
        field: user,
        header: user,
      })),
      { field: "Total", header: "Total" }
    ],
    excelConfig: {
      sheetName: "Métodos de Pago",
      columnWidths: [
        { wch: 25 },
        ...Array.from(billingUsers).map(() => ({ wch: 20 })),
        { wch: 20 }
      ],
    },
  });
};