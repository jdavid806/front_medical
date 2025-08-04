import { exportToExcel as originalExportToExcel } from "../../accounting/utils/ExportToExcelOptions.js";
// Wrapper function para exportToExcel
export const exportToExcel = async params => {
  const {
    excelConfig,
    ...restParams
  } = params;
  const compatibleParams = {
    ...restParams,
    ...(excelConfig?.sheetName && {
      sheetName: excelConfig.sheetName
    }),
    ...(excelConfig?.columnWidths && {
      columnWidths: excelConfig.columnWidths
    })
  };
  await originalExportToExcel(compatibleParams);
};

// Función para exportar procedimientos (corregida)
export const exportProceduresToExcel = async reportData => {
  if (!reportData || reportData.length === 0) {
    throw new Error("No hay datos para exportar");
  }
  const users = [...new Set(reportData.map(item => item.billing_user))];
  const procedures = [...new Set(reportData.flatMap(item => item.billed_procedure?.map(p => p.product.name) || []))];
  const excelData = procedures.map(proc => {
    const row = {
      Procedimiento: proc
    };
    let rowTotal = 0;
    users.forEach(user => {
      const amount = reportData.filter(item => item.billing_user === user).flatMap(item => item.billed_procedure || []).filter(p => p?.product.name === proc).reduce((sum, p) => sum + parseFloat(p.amount), 0);
      row[user] = amount;
      rowTotal += amount;
    });
    row['Total'] = rowTotal;
    return row;
  });
  const totalsRow = {
    Procedimiento: "Total"
  };
  let grandTotal = 0;
  users.forEach(user => {
    totalsRow[user] = excelData.reduce((sum, row) => sum + (row[user] || 0), 0);
    grandTotal += totalsRow[user];
  });
  totalsRow['Total'] = grandTotal;
  excelData.push(totalsRow);
  await exportToExcel({
    data: excelData,
    fileName: "Reporte_Procedimientos",
    columns: [{
      field: "Procedimiento",
      header: "Procedimiento"
    }, ...users.map(user => ({
      field: user,
      header: user
    })), {
      field: "Total",
      header: "Total"
    }],
    excelConfig: {
      sheetName: "Procedimientos",
      columnWidths: [{
        wch: 30
      }, ...users.map(() => ({
        wch: 20
      })), {
        wch: 20
      }]
    }
  });
};

// Función para exportar entidades (corregida)
export const exportEntitiesToExcel = async reportData => {
  if (!reportData || reportData.length === 0) {
    throw new Error("No hay datos para exportar");
  }
  const filteredData = reportData.filter(item => item.insurance);
  if (filteredData.length === 0) {
    throw new Error("No hay datos de entidades para exportar");
  }
  const entities = new Set();
  const billingUsers = new Set();
  const groupedData = {};
  const totals = {};
  filteredData.forEach(entry => {
    const {
      billing_user,
      insurance,
      billed_procedure
    } = entry;
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
    billed_procedure?.forEach(proc => {
      const amount = parseFloat(proc.amount) || 0;
      groupedData[insuranceName][billing_user] += amount;
      totals[billing_user] += amount;
    });
  });
  const excelData = Array.from(entities).map(entity => {
    const row = {
      Entidad: entity
    };
    let rowTotal = 0;
    Array.from(billingUsers).forEach(user => {
      const amount = groupedData[entity]?.[user] || 0;
      row[user] = amount.toFixed(2);
      rowTotal += amount;
    });
    row['Total'] = rowTotal.toFixed(2);
    return row;
  });
  const totalsRow = {
    Entidad: "Total"
  };
  let grandTotal = 0;
  Array.from(billingUsers).forEach(user => {
    totalsRow[user] = (totals[user] || 0).toFixed(2);
    grandTotal += totals[user] || 0;
  });
  totalsRow['Total'] = grandTotal.toFixed(2);
  excelData.push(totalsRow);
  await exportToExcel({
    data: excelData,
    fileName: "Reporte_Entidades",
    columns: [{
      field: "Entidad",
      header: "Entidad"
    }, ...Array.from(billingUsers).map(user => ({
      field: user,
      header: user
    })), {
      field: "Total",
      header: "Total"
    }],
    excelConfig: {
      sheetName: "Entidades",
      columnWidths: [{
        wch: 30
      }, ...Array.from(billingUsers).map(() => ({
        wch: 20
      })), {
        wch: 20
      }]
    }
  });
};

// Función para exportar métodos de pago (corregida)
export const exportPaymentsToExcel = async reportData => {
  if (!reportData || reportData.length === 0) {
    throw new Error("No hay datos para exportar");
  }
  const paymentMethods = new Set();
  const billingUsers = new Set();
  const groupedData = {};
  const totals = {};
  reportData.forEach(entry => {
    const {
      billing_user,
      payment_methods
    } = entry;
    if (!payment_methods || payment_methods.length === 0) return;
    billingUsers.add(billing_user);
    payment_methods.forEach(pm => {
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
  const excelData = Array.from(paymentMethods).map(method => {
    const row = {
      "Método de Pago": method
    };
    let rowTotal = 0;
    Array.from(billingUsers).forEach(user => {
      const amount = groupedData[method]?.[user] || 0;
      row[user] = amount.toFixed(2);
      rowTotal += amount;
    });
    row['Total'] = rowTotal.toFixed(2);
    return row;
  });
  const totalsRow = {
    "Método de Pago": "Total"
  };
  let grandTotal = 0;
  Array.from(billingUsers).forEach(user => {
    totalsRow[user] = (totals[user] || 0).toFixed(2);
    grandTotal += totals[user] || 0;
  });
  totalsRow['Total'] = grandTotal.toFixed(2);
  excelData.push(totalsRow);
  await exportToExcel({
    data: excelData,
    fileName: "Reporte_Metodos_Pago",
    columns: [{
      field: "Método de Pago",
      header: "Método de Pago"
    }, ...Array.from(billingUsers).map(user => ({
      field: user,
      header: user
    })), {
      field: "Total",
      header: "Total"
    }],
    excelConfig: {
      sheetName: "Métodos de Pago",
      columnWidths: [{
        wch: 25
      }, ...Array.from(billingUsers).map(() => ({
        wch: 20
      })), {
        wch: 20
      }]
    }
  });
};