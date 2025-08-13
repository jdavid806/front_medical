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
  inventories: {
    id: number;
    quantity: number;
    deposit_id: number;
    product_id: number;
  }[];
  [key: string]: any;
}

interface ProductInventoryReportProps {
  inventoryData: InventoryItem[];
  title?: string;
}

export const ProductInventoryFormat: React.FC<ProductInventoryReportProps> = ({
  inventoryData
}) => {
  // Filtrar productos que no son "Laboratorio"
  const filteredInventory = inventoryData.map(deposit => ({
    ...deposit,
    products: deposit.products.filter(product => product.name !== "Laboratorio")
  }));

  // Calcular el stock total de un producto en un depósito
  const getProductStock = (product: Product) => {
    return product.inventories.reduce((sum, inventory) => sum + inventory.quantity, 0);
  };

  // Calcular total de productos y stock para cada depósito
  const getInventorySummary = (inventory: InventoryItem) => {
    const totalProducts = inventory.products.length;
    const totalStock = inventory.products.reduce((sum, product) => sum + getProductStock(product), 0);
    
    return {
      totalProducts,
      totalStock
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
                <span className="badge bg-success">{depositSummary.totalStock} unidades en stock</span>
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
                  <th style={{ width: '20%' }}>Tipo</th>
                  <th style={{ width: '15%' }}>Precio Venta</th>
                  <th style={{ width: '15%' }}>Stock Actual</th>
                  <th style={{ width: '20%' }}>Stock Mín/Máx</th>
                </tr>
              </thead>
              <tbody>
                {deposit.products.map((product, productIndex) => {
                  const currentStock = getProductStock(product);
                  const isBelowMin = product.minimum_stock !== null && currentStock < product.minimum_stock;
                  const isAboveMax = product.maximum_stock !== null && currentStock > product.maximum_stock;
                  
                  return (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.product_type?.name || '--'}</td>
                      <td className="text-end">{formatCurrency(product.sale_price)}</td>
                      <td className={`text-end ${isBelowMin ? 'text-danger' : ''} ${isAboveMax ? 'text-warning' : ''}`}>
                        {currentStock}
                      </td>
                      <td className="text-center">
                        <span className={isBelowMin ? 'text-danger' : ''}>
                          {product.minimum_stock || '--'}
                        </span>
                        {' / '}
                        <span className={isAboveMax ? 'text-warning' : ''}>
                          {product.maximum_stock || '--'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <table className="table table-sm mb-0">
                    <tbody>
                      <tr>
                        <td><strong>Total Stock:</strong></td>
                        <td className="text-end">{depositSummary.totalStock} unidades</td>
                      </tr>
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