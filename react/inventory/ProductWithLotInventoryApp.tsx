import React, { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useProductInventory } from "./hooks/useProductInventory";
import { CustomModal } from "../components/CustomModal";
import { ProductInventoryDetail } from "./ProductInventoryDetail";
import { CustomFormModal } from "../components/CustomFormModal";
import { ProductInventoryForm, ProductInventoryFormInputs } from "./ProductInventoryForm";
import { useProductUpdate } from "../products/hooks/useProductUpdate";
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { formatDate } from "../../services/utilidades";
import { useProductWithLotInventory } from "./hooks/useProductWithLotInventory";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper";
import { EditTableAction } from "../components/table-actions/EditTableAction";
import { useProductWithLotInventoryFormat } from "../documents-generation/hooks/useProductWithLotInventoryFormat";

interface ProductInventoryAppProps {
  type: string;
}

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

export const ProductWithLotInventoryApp: React.FC<ProductInventoryAppProps> = ({ type }) => {
  const [expandedRows, setExpandedRows] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'expired'>('inventory');

  const { productInventory, loading, fetchProductWithLotInventory } = useProductWithLotInventory(type);
  const { updateProduct } = useProductUpdate();
  const { generarFormatoInventario } = useProductWithLotInventoryFormat();

  // Filtrar productos que no son "Laboratorio"
  const filteredInventory = productInventory.map(deposit => ({
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

    function openFormModal(selectedProduct: Product) {
    setSelectedProduct(structuredClone(selectedProduct));
    setShowFormModal(true);
  }

  // Plantilla de expansión para depósitos (muestra productos)
  const depositRowExpansionTemplate = (data: InventoryItem) => {
    return (
      <div className="p-3">
        <DataTable 
          value={data.products} 
          dataKey="id"
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={productRowExpansionTemplate}
          onRowClick={(e) => {
            setSelectedProduct(e.data as Product);
          }}
          selectionMode="single"
          selection={selectedProduct}
          onSelectionChange={(e) => setSelectedProduct(e.value)}
        >
          <Column expander style={{ width: '3rem' }} />
          <Column field="name" header="Producto" sortable />
          <Column header="Tipo" body={(rowData: Product) => rowData.product_type?.name || '--'} />
          <Column header="Precio" body={(rowData: Product) => `$${rowData.sale_price}`} />
          <Column header="Stock Mín/Máx" body={(rowData: Product) => 
            `${rowData.minimum_stock || '--'} / ${rowData.maximum_stock || '--'}`
          } />
          <Column header="Lotes Activos" body={(rowData: Product) => getActiveLots(rowData.lotes).length} />
          <Column header="Lotes Vencidos" body={(rowData: Product) => getExpiredLots(rowData.lotes).length} />
          {activeTab === 'inventory' && (
            <Column 
              header="Acciones" 
              body={(rowData: Product) => (
                <>
          <TableActionsWrapper>
            <EditTableAction onTrigger={() => openFormModal(rowData)} />
              <li>
            <a className="dropdown-item"
                href="#"
                onClick={() => {
                  setSelectedProduct(rowData);
                  setShowDetailModal(true);
                }}>
                <div className="d-flex gap-2 align-items-center">
                    <i className="fa-solid fa-eye" style={{ width: '20px' }}></i>
                    <span>Ver más</span>
                </div>
            </a>
        </li>
          </TableActionsWrapper>
        </>
              )}
            />
          )}
        </DataTable>
      </div>
    );
  };

  // Plantilla de expansión para productos (muestra lotes)
  const productRowExpansionTemplate = (data: Product) => {
    const lotsToShow = activeTab === 'inventory' ? getActiveLots(data.lotes) : getExpiredLots(data.lotes);
    
    return (
      <div className="p-3">
        <DataTable value={lotsToShow}>
          <Column field="lot_number" header="N° Lote" sortable />
          <Column 
            field="expiration_date" 
            header="Fecha Vencimiento" 
            sortable 
            body={(rowData: Lot) => formatDate(rowData.expiration_date)}
          />
          <Column field="quantity" header="Cantidad" sortable />
          <Column field="purchase_price" header="Precio Compra" body={(rowData: Lot) => `$${rowData.purchase_price}`} />
          {activeTab === 'inventory' && (
            <Column 
              header="Estado" 
              body={(rowData: Lot) => {

                const expirationStatus = rowData.expiration_status;
                const severity = {
                  active: 'success',
                  'expiring_soon': 'warning',
                  expired: 'danger'
                }
                const label = {
                  active: 'Activo',
                  'expiring_soon': 'Próximo a vencer',
                  expired: 'Vencido'
                }

                return (
                <Tag 
                  severity={severity[expirationStatus]}
                  value={label[expirationStatus]}
                />
              )
              }}
            />
          )}
        </DataTable>
      </div>
    );
  };

  // Resumen del depósito para la fila principal
  const depositSummaryTemplate = (data: InventoryItem) => {
    const summary = getInventorySummary(data);
    
    return (
      <div className="d-flex flex-column gap-1">
        <span className="font-bold">{data.name}</span>
        <div className="d-flex flex-wrap gap-3">
          <Badge severity="info" value={`${summary.totalProducts} productos`}></Badge>
          <Badge severity="success" value={`${summary.totalActiveLots} lotes activos`}></Badge>
          <Badge severity="warning" value={`${summary.totalExpiringSoonLots} lotes próximos a vencer`}></Badge>
          <Badge severity="danger" value={`${summary.totalExpiredLots} lotes vencidos`}></Badge>
        </div>
      </div>
    );
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowFormModal(true);
  };

  const onHandleSubmit = async (data: ProductInventoryFormInputs) => {
    if (!selectedProduct) return;
    
    updateProduct(selectedProduct.id.toString(), {
      product: data,
      entities: [],
    }).then(() => {
      setShowFormModal(false);
      fetchProductWithLotInventory();
    });
  };

  const exportToPDF = () => {
    generarFormatoInventario(productInventory, 'inventario-productos', 'Impresion');
  }

  return (
    <>
      <div className="mb-3">

        <div className="row">
            <div className="col-auto">
                                      <Button 
                                        label="Exportar a PDF" 
                                        icon={<i className="fa-solid fa-file-pdf"></i>} 
                                        className="btn btn-primary"
                                        onClick={() => exportToPDF()}
                                      />
                                    </div>
          <div className="col-12">

        <div className="flex justify-content-between align-items-center mb-4 p-2">
          <div className="p-buttonset">
            <Button 
              label="Inventario Activo" 
              className={activeTab === 'inventory' ? '' : 'p-button-outlined'}
              onClick={() => {
                setActiveTab('inventory');
                setSelectedProduct(null);
              }}
            />
            <Button 
              label="Inventario Vencido" 
              className={activeTab === 'expired' ? '' : 'p-button-outlined'}
              onClick={() => {
                setActiveTab('expired');
                setSelectedProduct(null);
              }}
            />
          </div>
        </div>
            <DataTable
              value={filteredInventory}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={depositRowExpansionTemplate}
              dataKey="id"
              loading={loading}
            >
              <Column expander style={{ width: '3rem' }} />
              <Column body={depositSummaryTemplate} />
            </DataTable>
          </div>
        </div>
      </div>

      <CustomModal
        title="Detalles del producto"
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
      >
        <ProductInventoryDetail product={selectedProduct} />
      </CustomModal>

      <CustomFormModal
        formId="product-inventory-form"
        title="Editar inventario del producto"
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
      >
        <ProductInventoryForm
          formId="product-inventory-form"
          productId={selectedProduct?.id.toString() || ""}
          onHandleSubmit={onHandleSubmit}
        />
      </CustomFormModal>
    </>
  );
};