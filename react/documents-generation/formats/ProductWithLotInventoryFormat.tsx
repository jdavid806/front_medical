import React from "react";
import { formatDate } from "../../../services/utilidades";

interface InventoryItem {
  id: number;
  name: string;
  notes: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string;
  products: Product[];
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  sale_price: number;
  minimum_stock: number | null;
  maximum_stock: number | null;
  product_type: {
    id: number;
    name: string;
  };
  lotes: Lot[];
  [key: string]: any;
}

interface Lot {
  id: number;
  lot_number: string;
  expiration_date: string;
  purchase_price: string;
  expiration_status: string;
  quantity: number;
  is_perishable: boolean;
  [key: string]: any;
}

interface ProductInventoryReportProps {
  inventoryData: InventoryItem[];
  title?: string;
  showExpired?: boolean;
}

export const ProductWithLotInventoryFormat: React.FC<ProductInventoryReportProps> = ({
  inventoryData,
  showExpired = true
}) => {
  // Filtrar productos que no son "Laboratorio"
  const filteredInventory = inventoryData.map(deposit => ({
    ...deposit,
    products: deposit.products.filter(product => product.name !== "Laboratorio")
  }));

  // Filtrar lotes activos y vencidos
  const getActiveLots = (lots: Lot[]) => {
    return lots.filter(lot => lot.expiration_status !== 'expired');
  };

  const getExpiringSoonLots = (lots: Lot[]) => {
    return lots.filter(lot => lot.expiration_status === 'expiring_soon');
  };

  const getExpiredLots = (lots: Lot[]) => {
    return lots.filter(lot => lot.expiration_status === 'expired');
  };

  // Calcular total de productos y lotes para cada depósito
  const getInventorySummary = (inventory: InventoryItem) => {
    const totalProducts = inventory.products.length;
    const totalActiveLots = inventory.products.reduce((sum, product) => sum + getActiveLots(product.lotes).length, 0);
    const totalExpiringSoonLots = inventory.products.reduce((sum, product) => sum + getExpiringSoonLots(product.lotes).length, 0);
    const totalExpiredLots = inventory.products.reduce((sum, product) => sum + getExpiredLots(product.lotes).length, 0);
    
    return {
      totalProducts,
      totalActiveLots,
      totalExpiringSoonLots,
      totalExpiredLots
    };
  };

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Obtener estado del lote como etiqueta
  const getLotStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Activo',
      expiring_soon: 'Próximo a vencer',
      expired: 'Vencido'
    };
    return labels[status] || status;
  };

  // Obtener clase CSS para el estado del lote
  const getLotStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      active: 'text-success',
      expiring_soon: 'text-warning',
      expired: 'text-danger'
    };
    return classes[status] || '';
  };

  return (
    <div className="inventory-report">
      {filteredInventory.map((deposit, depositIndex) => {
        const depositSummary = getInventorySummary(deposit);
        
        return (
          <div key={deposit.id} className="mb-4">
            {/* Encabezado del depósito */}
            <div className="deposit-header p-2 mb-2" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
              <h4 className="mb-1">{deposit.name}</h4>
              <div className="d-flex flex-wrap gap-3">
                <span className="badge bg-info">{depositSummary.totalProducts} productos</span>
                <span className="badge bg-success">{depositSummary.totalActiveLots} lotes activos</span>
                <span className="badge bg-warning text-dark">{depositSummary.totalExpiringSoonLots} próximos a vencer</span>
                {showExpired && <span className="badge bg-danger">{depositSummary.totalExpiredLots} lotes vencidos</span>}
              </div>
            </div>

            {/* Tabla de productos */}
            <table className="table table-bordered mb-3">
              <thead>
                <tr>
                  <th colSpan={6} className="bg-light">
                    <h5 className="mb-0 p-1">Productos en {deposit.name}</h5>
                  </th>
                </tr>
                <tr>
                  <th style={{ width: '30%' }}>Producto</th>
                  <th style={{ width: '15%' }}>Tipo</th>
                  <th style={{ width: '15%' }}>Precio Venta</th>
                  <th style={{ width: '15%' }}>Stock Mín/Máx</th>
                  <th style={{ width: '12%' }}>Lotes Activos</th>
                  {showExpired && <th style={{ width: '13%' }}>Lotes Vencidos</th>}
                </tr>
              </thead>
              <tbody>
                {deposit.products.map((product, productIndex) => (
                  <React.Fragment key={product.id}>
                    {/* Fila del producto */}
                    <tr>
                      <td>{product.name}</td>
                      <td>{product.product_type?.name || '--'}</td>
                      <td className="text-end">{formatCurrency(product.sale_price)}</td>
                      <td className="text-center">
                        {product.minimum_stock || '--'} / {product.maximum_stock || '--'}
                      </td>
                      <td className="text-center">{getActiveLots(product.lotes).length}</td>
                      {showExpired && <td className="text-center">{getExpiredLots(product.lotes).length}</td>}
                    </tr>

                    {/* Lotes activos del producto */}
                    {getActiveLots(product.lotes).length > 0 && (
                      <tr>
                        <td colSpan={showExpired ? 6 : 5} className="p-0">
                          <table className="table table-sm mb-0" style={{ backgroundColor: '#f8f9fa' }}>
                            <thead>
                              <tr>
                                <th colSpan={6} className="bg-light">
                                  <small>Lotes activos de {product.name}</small>
                                </th>
                              </tr>
                              <tr>
                                <th style={{ width: '15%' }}>N° Lote</th>
                                <th style={{ width: '20%' }}>Fecha Vencimiento</th>
                                <th style={{ width: '15%' }}>Cantidad</th>
                                <th style={{ width: '15%' }}>Precio Compra</th>
                                <th style={{ width: '15%' }}>Estado</th>
                                <th style={{ width: '20%' }}>Perecedero</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getActiveLots(product.lotes).map((lot, lotIndex) => (
                                <tr key={lot.id}>
                                  <td>{lot.lot_number}</td>
                                  <td>{formatDate(lot.expiration_date)}</td>
                                  <td className="text-end">{lot.quantity}</td>
                                  <td className="text-end">{formatCurrency(Number(lot.purchase_price))}</td>
                                  <td className={getLotStatusClass(lot.expiration_status)}>
                                    {getLotStatusLabel(lot.expiration_status)}
                                  </td>
                                  <td>{lot.is_perishable ? 'Sí' : 'No'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}

                    {/* Lotes vencidos del producto (si se muestran) */}
                    {showExpired && getExpiredLots(product.lotes).length > 0 && (
                      <tr>
                        <td colSpan={6} className="p-0">
                          <table className="table table-sm mb-0" style={{ backgroundColor: '#fff0f0' }}>
                            <thead>
                              <tr>
                                <th colSpan={6} className="bg-danger text-white">
                                  <small>Lotes vencidos de {product.name}</small>
                                </th>
                              </tr>
                              <tr>
                                <th style={{ width: '15%' }}>N° Lote</th>
                                <th style={{ width: '20%' }}>Fecha Vencimiento</th>
                                <th style={{ width: '15%' }}>Cantidad</th>
                                <th style={{ width: '15%' }}>Precio Compra</th>
                                <th style={{ width: '15%' }}>Estado</th>
                                <th style={{ width: '20%' }}>Perecedero</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getExpiredLots(product.lotes).map((lot, lotIndex) => (
                                <tr key={lot.id}>
                                  <td>{lot.lot_number}</td>
                                  <td>{formatDate(lot.expiration_date)}</td>
                                  <td className="text-end">{lot.quantity}</td>
                                  <td className="text-end">{formatCurrency(Number(lot.purchase_price))}</td>
                                  <td className="text-danger">Vencido</td>
                                  <td>{lot.is_perishable ? 'Sí' : 'No'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Resumen del depósito */}
            <div className="deposit-summary p-2 mt-2" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
              <h5 className="mb-2">Resumen de {deposit.name}</h5>
              <div className="row">
                <div className="col-md-6">
                  <table className="table table-sm mb-0">
                    <tbody>
                      <tr>
                        <td><strong>Total Productos:</strong></td>
                        <td className="text-end">{depositSummary.totalProducts}</td>
                      </tr>
                      <tr>
                        <td><strong>Lotes Activos:</strong></td>
                        <td className="text-end">{depositSummary.totalActiveLots}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <table className="table table-sm mb-0">
                    <tbody>
                      <tr>
                        <td><strong>Lotes Próximos a Vencer:</strong></td>
                        <td className="text-end">{depositSummary.totalExpiringSoonLots}</td>
                      </tr>
                      {showExpired && (
                        <tr>
                          <td><strong>Lotes Vencidos:</strong></td>
                          <td className="text-end">{depositSummary.totalExpiredLots}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Estilos para impresión */}
      <style>{`
        .inventory-report {
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: #000;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        
        .table th, .table td {
          padding: 0.5rem;
          border: 1px solid #dee2e6;
          vertical-align: middle;
        }
        
        .table th {
          background-color: #f8f9fa;
          font-weight: bold;
          text-align: left;
        }
        
        .text-end {
          text-align: right !important;
        }
        
        .text-center {
          text-align: center !important;
        }
        
        .badge {
          display: inline-block;
          padding: 0.25em 0.4em;
          font-size: 75%;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25rem;
        }
        
        .bg-info {
          background-color: #17a2b8 !important;
          color: white;
        }
        
        .bg-success {
          background-color: #28a745 !important;
          color: white;
        }
        
        .bg-warning {
          background-color: #ffc107 !important;
          color: #212529;
        }
        
        .bg-danger {
          background-color: #dc3545 !important;
          color: white;
        }
        
        .text-success {
          color: #28a745 !important;
        }
        
        .text-warning {
          color: #ffc107 !important;
        }
        
        .text-danger {
          color: #dc3545 !important;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
            color: #000;
            background: #fff;
          }
          
          .inventory-report {
            font-size: 10pt;
          }
          
          .table {
            page-break-inside: avoid;
          }
          
          .deposit-header, .deposit-summary {
            page-break-after: avoid;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};