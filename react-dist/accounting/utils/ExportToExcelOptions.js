// Función auxiliar para cargar scripts dinámicamente
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}
export const exportToExcel = async options => {
  try {
    const {
      data,
      fileName,
      columns,
      dt,
      selectionOnly,
      excludeColumns
    } = options;
    if (dt?.current && selectionOnly) {
      dt.current.exportCSV({
        selectionOnly: true
      });
      return;
    }

    // Carga dinámica si no está disponible
    if (!window.XLSX) {
      await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    }
    if (!window.saveAs) {
      await loadScript('https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js');
    }
    if (!window.XLSX || !window.saveAs) {
      throw new Error('Required libraries failed to load');
    }
    let processedData = [...data];
    if (excludeColumns && excludeColumns.length > 0) {
      processedData = data.map(item => {
        const newItem = {
          ...item
        };
        excludeColumns.forEach(col => {
          delete newItem[col];
        });
        return newItem;
      });
    }
    const worksheet = columns ? window.XLSX.utils.json_to_sheet(processedData, {
      header: columns.map(col => col.field)
    }) : window.XLSX.utils.json_to_sheet(processedData);
    const workbook = {
      Sheets: {
        data: worksheet
      },
      SheetNames: ['data']
    };
    const excelBuffer = window.XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const blob = new Blob([excelBuffer], {
      type: EXCEL_TYPE
    });
    window.saveAs(blob, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Error al exportar a Excel. Por favor recarga la página.');
    throw error;
  }
};
async function loadPDFLibraries() {
  try {
    // Verificar si ya están cargadas
    const PDF = window.jspdf?.jsPDF || window.jsPDF;
    if (typeof PDF === 'function' && typeof PDF.prototype.autoTable === 'function') {
      return;
    }

    // Cargar jsPDF
    const jsPDFLoaded = await loadScriptWithFallback('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');

    // Cargar autoTable
    const autoTableLoaded = await loadScriptWithFallback('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js', 'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.28/dist/jspdf.plugin.autotable.min.js');
    if (!jsPDFLoaded || !autoTableLoaded) {
      throw new Error('Failed to load PDF libraries');
    }

    // Verificar la carga correcta
    const PDFConstructor = window.jspdf?.jsPDF || window.jsPDF;
    if (!PDFConstructor || !PDFConstructor.prototype.autoTable) {
      throw new Error('PDF libraries not initialized properly');
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.error('Error loading PDF libraries:', error);
    throw new Error('Failed to load PDF libraries: ' + error.message);
  }
}
async function loadScriptWithFallback(...urls) {
  for (const url of urls) {
    try {
      await loadScript(url);

      // Manejo especial para jsPDF
      if (url.includes('jspdf')) {
        // jsPDF v2+ se carga bajo el namespace jspdf
        if (window.jspdf) {
          window.jsPDF = window.jspdf.jsPDF;
        }
        // Si ya está disponible directamente como jsPDF, no hacemos nada
      }
      return true;
    } catch (error) {
      console.warn(`Failed to load from ${url}, trying next...`);
    }
  }
  return false;
}
export const exportToPDF = async options => {
  try {
    const {
      columns,
      data,
      fileName
    } = options;
    await loadPDFLibraries();

    // Obtener la referencia correcta a jsPDF
    const PDF = window.jspdf?.jsPDF || window.jsPDF;
    if (!PDF || !PDF.prototype.autoTable) {
      throw new Error('PDF libraries not available');
    }

    // Crear documento PDF - SIN usar .default
    const doc = new PDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configuración del documento
    doc.setCreator('Sistema de Facturación');
    doc.setCreationDate(new Date());

    // Título del documento
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle de Factura', 105, 20, {
      align: 'center'
    });

    // Subtítulo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado: ${new Date().toLocaleString('es-DO')}`, 105, 28, {
      align: 'center'
    });

    // Preparar datos para la tabla
    const headers = columns.map(col => col.header);
    const body = data.map(item => columns.map(col => {
      const value = item[col.field];
      // Manejar valores undefined/null
      if (value === undefined || value === null) return '';
      // Convertir a string
      return String(value);
    }));

    // Generar tabla
    doc.autoTable({
      head: [headers],
      body: body,
      startY: 35,
      margin: {
        top: 30,
        left: 10,
        right: 10
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        font: 'helvetica',
        textColor: [0, 0, 0],
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: {
          cellWidth: 'auto'
        },
        1: {
          cellWidth: 'auto'
        },
        2: {
          cellWidth: 'auto'
        }
      },
      didDrawPage: data => {
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Página ${data.pageNumber}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, {
          align: 'center'
        });
      }
    });

    // Guardar el documento
    const safeFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeFileName}_${new Date().getTime()}.pdf`);
  } catch (error) {
    console.error('Error en exportToPDF:', {
      error,
      message: error.message,
      stack: error.stack
    });
    throw new Error(`No se pudo generar el PDF: ${error.message}`);
  }
};