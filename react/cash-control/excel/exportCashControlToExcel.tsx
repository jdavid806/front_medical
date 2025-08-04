// types.ts
export interface DataTableValueArray extends Array<any> {}

export interface ExportToExcelOptions<T extends DataTableValueArray> {
  data: T;
  fileName: string;
  columns?: {
    field: string;
    header: string;
  }[];
  dt?: React.RefObject<any>;
  selectionOnly?: boolean;
  excludeColumns?: string[];
  additionalExcelOptions?: {
    sheetName?: string;
    columnWidths?: any[];
  };
}

export interface CierreCajaExcelOptions {
  cierres: any[];
  fileName?: string;
  sheetName?: string;
}

declare global {
  interface Window {
    XLSX: any;
    saveAs: any;
    jspdf?: {
      jsPDF: new (options?: any) => any;
    };
    jsPDF?: new (options?: any) => any;
    autoTable: any;
  }
}

// Función auxiliar para cargar scripts dinámicamente
async function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve();
    }

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

// Función para formatear moneda
const formatCurrency = (amount: number): string => {
  return `$ ${new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`.replace("DOP", "");
};

// Función para formatear fecha
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX");
};

// Columnas predefinidas para el Excel de cierres
const CIERRES_COLUMNS = [
  { field: "Control", header: "Control" },
  { field: "Fecha", header: "Fecha" },
  { field: "Total Recibido", header: "Total Recibido" },
  { field: "Sobrante", header: "Sobrante" },
  { field: "Entregado por", header: "Entregado por" },
  { field: "Validado por", header: "Validado por" },
  { field: "Método de Pago", header: "Método de Pago" },
  { field: "Esperado", header: "Esperado" },
  { field: "Recibido", header: "Recibido" },
  { field: "Diferencia", header: "Diferencia" },
];

// Configuración de ancho de columnas
const CIERRES_COL_WIDTHS = [
  { wch: 15 }, // Control
  { wch: 12 }, // Fecha
  { wch: 15 }, // Total Recibido
  { wch: 15 }, // Sobrante
  { wch: 25 }, // Entregado por
  { wch: 25 }, // Validado por
  { wch: 20 }, // Método de Pago
  { wch: 15 }, // Esperado
  { wch: 15 }, // Recibido
  { wch: 15 }, // Diferencia
];

// Función para transformar los datos de cierres a un formato compatible con exportToExcel
// Función para transformar los datos de cierres a un formato compatible con exportToExcel
const transformCierresToExcelData = (cierres: any[]) => {
  // Primero, calculamos los totales por método de pago para todos los cierres
  const totalesPorMetodo: Record<
    string,
    { esperado: number; recibido: number; diferencia: number }
  > = {};

  cierres.forEach((cierre) => {
    cierre.details?.forEach((detalle) => {
      if (!totalesPorMetodo[detalle.payment_method_name]) {
        totalesPorMetodo[detalle.payment_method_name] = {
          esperado: 0,
          recibido: 0,
          diferencia: 0,
        };
      }
      // Aseguramos que los valores sean números antes de sumar
      totalesPorMetodo[detalle.payment_method_name].esperado +=
        Number(detalle.total_expected) || 0;
      totalesPorMetodo[detalle.payment_method_name].recibido +=
        Number(detalle.total_received) || 0;
      totalesPorMetodo[detalle.payment_method_name].diferencia +=
        Number(detalle.remaining_amount) || 0;
    });
  });

  // Calculamos los totales generales
  const totalGeneral = {
    esperado: cierres.reduce(
      (sum, c) => sum + (Number(c.total_expected) || 0),
      0
    ),
    recibido: cierres.reduce(
      (sum, c) => sum + (Number(c.total_received) || 0),
      0
    ),
    diferencia: cierres.reduce(
      (sum, c) => sum + (Number(c.remaining_amount) || 0),
      0
    ),
  };

  // Generamos las filas normales de cada cierre
  const rows = cierres.flatMap((cierre) => {
    const baseData = {
      Control: "Cierre de Caja",
      Fecha: formatDate(cierre.created_at),
      "Total Recibido": formatCurrency(cierre.total_received),
      Sobrante: formatCurrency(cierre.remaining_amount),
      "Entregado por": cierre.who_delivers_name,
      "Validado por": cierre.who_validate_name,
      "Método de Pago": "",
      Esperado: "",
      Recibido: "",
      Diferencia: "",
    };

    const detailRows =
      cierre.details?.map((detalle) => ({
        Control: "",
        Fecha: "",
        "Total Recibido": "",
        Sobrante: "",
        "Entregado por": "",
        "Validado por": "",
        "Método de Pago": detalle.payment_method_name,
        Esperado: formatCurrency(detalle.total_expected),
        Recibido: formatCurrency(detalle.total_received),
        Diferencia: formatCurrency(detalle.remaining_amount),
      })) || [];

    const totalRow = {
      Control: "",
      Fecha: "",
      "Total Recibido": "",
      Sobrante: "",
      "Entregado por": "",
      "Validado por": "",
      "Método de Pago": "Total Cierre",
      Esperado: formatCurrency(cierre.total_expected),
      Recibido: formatCurrency(cierre.total_received),
      Diferencia: formatCurrency(cierre.remaining_amount),
    };

    const emptyRow = {
      Control: "",
      Fecha: "",
      "Total Recibido": "",
      Sobrante: "",
      "Entregado por": "",
      "Validado por": "",
      "Método de Pago": "",
      Esperado: "",
      Recibido: "",
      Diferencia: "",
    };

    return [baseData, ...detailRows, totalRow, emptyRow];
  });

  // Agregamos los totales generales por método de pago al final
  const totalesGeneralesRows = [
    {
      Control: "TOTALES GENERALES",
      Fecha: "",
      "Total Recibido": "",
      Sobrante: "",
      "Entregado por": "",
      "Validado por": "",
      "Método de Pago": "",
      Esperado: "",
      Recibido: "",
      Diferencia: "",
    },
    ...Object.entries(totalesPorMetodo).map(([metodo, totales]) => ({
      Control: "",
      Fecha: "",
      "Total Recibido": "",
      Sobrante: "",
      "Entregado por": "",
      "Validado por": "",
      "Método de Pago": metodo,
      Esperado: formatCurrency(totales.esperado),
      Recibido: formatCurrency(totales.recibido),
      Diferencia: formatCurrency(totales.diferencia),
    })),
    {
      Control: "",
      Fecha: "",
      "Total Recibido": "",
      Sobrante: "",
      "Entregado por": "",
      "Validado por": "",
      "Método de Pago": "TOTAL GENERAL",
      Esperado: formatCurrency(totalGeneral.esperado),
      Recibido: formatCurrency(totalGeneral.recibido),
      Diferencia: formatCurrency(totalGeneral.diferencia),
    },
    {
      Control: "",
      Fecha: "",
      "Total Recibido": "",
      Sobrante: "",
      "Entregado por": "",
      "Validado por": "",
      "Método de Pago": "",
      Esperado: "",
      Recibido: "",
      Diferencia: "",
    },
  ];

  return [...rows, ...totalesGeneralesRows];
};

export const exportToExcel = async <T extends DataTableValueArray>(
  options: ExportToExcelOptions<T>
): Promise<void> => {
  try {
    const {
      data,
      fileName,
      columns,
      dt,
      selectionOnly,
      excludeColumns,
      additionalExcelOptions = {},
    } = options;

    const { sheetName = "data", columnWidths } = additionalExcelOptions;

    if (dt?.current && selectionOnly) {
      dt.current.exportCSV({ selectionOnly: true });
      return;
    }

    // Carga dinámica si no está disponible
    if (!window.XLSX) {
      await loadScript(
        "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"
      );
    }

    if (!window.saveAs) {
      await loadScript(
        "https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"
      );
    }

    if (!window.XLSX || !window.saveAs) {
      throw new Error("Required libraries failed to load");
    }

    let processedData = [...data];
    if (excludeColumns && excludeColumns.length > 0) {
      processedData = data.map((item: any) => {
        const newItem = { ...item };
        excludeColumns.forEach((col) => {
          delete newItem[col];
        });
        return newItem;
      });
    }

    const worksheet = columns
      ? window.XLSX.utils.json_to_sheet(processedData, {
          header: columns.map((col) => col.field),
        })
      : window.XLSX.utils.json_to_sheet(processedData);

    // Aplicar anchos de columna si se especifican
    if (columnWidths) {
      worksheet["!cols"] = columnWidths;
    }

    const workbook = {
      Sheets: { [sheetName]: worksheet },
      SheetNames: [sheetName],
    };

    const excelBuffer = window.XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const blob = new Blob([excelBuffer], { type: EXCEL_TYPE });

    window.saveAs(
      blob,
      `${fileName}_${new Date().getTime()}${EXCEL_EXTENSION}`
    );
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("Error al exportar a Excel. Por favor recarga la página.");
    throw error;
  }
};

export const exportCierresCajaToExcel = async (
  options: CierreCajaExcelOptions
): Promise<void> => {
  const {
    cierres,
    fileName = "Cierres_de_Caja",
    sheetName = "Cierres de Caja",
  } = options;

  try {
    // Transformar los datos de cierres al formato requerido
    const excelData = transformCierresToExcelData(cierres);

    // Usar la función existente exportToExcel
    await exportToExcel({
      data: excelData,
      fileName,
      columns: CIERRES_COLUMNS,
      additionalExcelOptions: {
        sheetName,
        columnWidths: CIERRES_COL_WIDTHS,
      },
    });
  } catch (error) {
    console.error("Error exporting cierres de caja to Excel:", error);
    alert(
      "Error al exportar los cierres de caja a Excel. Por favor recarga la página."
    );
    throw error;
  }
};
