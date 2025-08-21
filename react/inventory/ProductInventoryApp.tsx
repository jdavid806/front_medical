import React, { useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomModal } from "../components/CustomModal";
import { ProductInventoryDetail } from "./ProductInventoryDetail";
import { CustomFormModal } from "../components/CustomFormModal";
import { ProductInventoryForm, ProductInventoryFormInputs } from "./ProductInventoryForm";
import { useProductUpdate } from "../products/hooks/useProductUpdate";
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { useProductInventory } from "./hooks/useProductInventory";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper";
import { EditTableAction } from "../components/table-actions/EditTableAction";
import { useProductInventoryOnlyDeposits } from "./hooks/useProductInventoryOnlyDeposits";
import { useProductInventoryFormat } from "../documents-generation/hooks/useProductInventoryFormat";

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
  inventories: {
    id: number;
    quantity: number;
    deposit_id: number;
    product_id: number;
  }[];
  [key: string]: any;
}

export const ProductInventoryApp: React.FC<ProductInventoryAppProps> = ({ type }) => {
  const [expandedRows, setExpandedRows] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const { productInventory, loading, fetchProductInventoryOnlyDeposits } = useProductInventoryOnlyDeposits(type);
  const { updateProduct } = useProductUpdate();
  const { generarFormatoInventario } = useProductInventoryFormat();

  // Filtrar productos que no son "Laboratorio"
  const filteredInventory = productInventory.map(deposit => ({
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
          onRowClick={(e) => {
            setSelectedProduct(e.data as Product);
          }}
          selectionMode="single"
          selection={selectedProduct}
          onSelectionChange={(e) => setSelectedProduct(e.value)}
        >
          <Column field="name" header="Producto" sortable />
          <Column header="Tipo" body={(rowData: Product) => rowData.product_type?.name || '--'} />
          <Column header="Precio" body={(rowData: Product) => `$${rowData.sale_price}`} />
          <Column header="Stock" body={(rowData: Product) => getProductStock(rowData)} />
          <Column header="Stock Mín/Máx" body={(rowData: Product) =>
            `${rowData.minimum_stock || '--'} / ${rowData.maximum_stock || '--'}`
          } />
          <Column

            header="Acciones"
            body={(rowData: Product) => (
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
            )}
          />
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
          <Badge severity="success" value={`${summary.totalStock} unidades en stock`}></Badge>
        </div>
      </div>
    );
  };

  const onHandleSubmit = async (data: ProductInventoryFormInputs) => {
    if (!selectedProduct) return;

    updateProduct(selectedProduct.id.toString(), {
      product: data,
      entities: [],
    }).then(() => {
      setShowFormModal(false);
      fetchProductInventoryOnlyDeposits();
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
          <div className="col-12 col-md-12">
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