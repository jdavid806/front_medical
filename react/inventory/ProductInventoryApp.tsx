import React, { useEffect, useState } from "react";
import { useProductInventory } from "./hooks/useProductInventory";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../components/CustomPRTable";
import { CustomModal } from "../components/CustomModal";
import { ProductInventoryDetail } from "./ProductInventoryDetail";
import { CustomFormModal } from "../components/CustomFormModal";
import {
  ProductInventoryForm,
  ProductInventoryFormInputs,
} from "./ProductInventoryForm";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper";
import { EditTableAction } from "../components/table-actions/EditTableAction";
import { useProductUpdate } from "../products/hooks/useProductUpdate";
import { set } from "react-hook-form";
import { stringToDate } from "../../services/utilidades";

interface ProductInventoryTableItem {
  uuid: string;
  name: string;
  stock: string;
  weight: string;
  capacity: string;
  concentration: string;
  expiration_date: string;
  original: any;
}

interface ProductInventoryAppProps {
  type: string;
}

export const ProductInventoryApp: React.FC<ProductInventoryAppProps> = ({
  type,
}) => {
  const [tableItems, setTableItems] = useState<ProductInventoryTableItem[]>([]);
  const [expiredTableItems, setExpiredTableItems] = useState<
    ProductInventoryTableItem[]
  >([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductInventoryTableItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const { productInventory, loading, fetchProductInventory } =
    useProductInventory(type);
  const { updateProduct } = useProductUpdate();

  useEffect(() => {
    const mappedItems: ProductInventoryTableItem[] = productInventory.map(
      (product) => {
        return {
          uuid: product.id,
          name: product.name,
          stock: product.stock?.toString() || "--",
          weight: product.weight?.toString() || "--",
          capacity: product.capacity?.toString() || "--",
          concentration: product.concentration?.toString() || "--",
          expiration_date: product.expiration_date
            ? new Intl.DateTimeFormat("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(
                new Date(
                  new Date(product.expiration_date).getTime() +
                    24 * 60 * 60 * 1000
                )
              )
            : "--",
          original: product,
        };
      }
    );
    setTableItems(mappedItems);
  }, [productInventory]);

  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    const expiredTableItems = tableItems.filter((item) => {
      const expirationDate = stringToDate(item.original.expiration_date);

      return (
        (expirationDate.getTime() <= today.getTime() ||
        expirationDate.getTime() <= oneMonthAgo.getTime()) && (item.original.expiration_date !== null)
      );
    });
    setExpiredTableItems(expiredTableItems);
  }, [tableItems]);

  function openFormModal(selectedProduct: ProductInventoryTableItem) {
    setSelectedProduct(structuredClone(selectedProduct));
    setShowFormModal(true);
  }

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "name",
      header: "Nombre",
      sortable: true,
    },
    {
      field: "stock",
      header: "Stock",
      sortable: true,
    },
    {
      field: "weight",
      header: "Peso",
      sortable: true,
    },
    {
      field: "capacity",
      header: "Capacidad",
      sortable: true,
    },
    {
      field: "concentration",
      header: "Concentración",
      sortable: true,
    },
    {
      field: "expiration_date",
      header: "Fecha de vencimiento",
      sortable: true,
    },
    {
      field: "actions",
      header: "Acciones",
      sortable: false,
      frozen: false,
      body: (rowData: ProductInventoryTableItem) => (
        <>
          <TableActionsWrapper>
            <EditTableAction onTrigger={() => openFormModal(rowData)} />
          </TableActionsWrapper>
        </>
      ),
    },
  ];

  const handleRowSelect = (rowData: ProductInventoryTableItem) => {
    setSelectedProduct(structuredClone(rowData));
  };

  const onHandleSubmit = async (data: ProductInventoryFormInputs) => {

    updateProduct(selectedProduct?.uuid || "", {
      product: data,
      entities: [],
    }).then(() => {
      setShowFormModal(false);
      fetchProductInventory();
    });
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col-md-8">
          <CustomPRTable
            data={tableItems}
            columns={columns}
            globalFilterFields={[
              "name",
              "stock",
              "weight",
              "capacity",
              "concentration",
              "expiration_date",
            ]}
            onSelectedRow={handleRowSelect}
            loading={loading}
            onReload={fetchProductInventory}
            selectionActive
          />
        </div>
        <div className="col-md-4">
          <div className="card animated-card">
            <div className="card-body">
              <h4 className="card-title">
                {selectedProduct?.name || "Selecciona un producto"}
              </h4>
              <div className="card-content">
                <p>
                  <strong>Tipo:</strong>{" "}
                  <span>
                    {selectedProduct?.original.product_type?.name || "--"}
                  </span>
                </p>
                <p>
                  <strong>Stock:</strong>{" "}
                  <span>{selectedProduct?.stock || "--"}</span>
                </p>
                <p>
                  <strong>Precio:</strong>{" "}
                  <span>{selectedProduct?.original.sale_price || "--"}</span>
                </p>
              </div>
              {selectedProduct && (
                <button
                  className="btn btn-sm btn-primary"
                  type="button"
                  onClick={() => setShowDetailModal(true)}
                >
                  Ver más
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card h-100 animated-card">
            <div className="card-body">
              <div className="text-center mb-3">
                <h4>
                  Los siguientes productos se encuentran próximos a caducar o se
                  encuentran caducados
                </h4>
              </div>
              <CustomPRTable
                data={expiredTableItems}
                columns={columns}
                globalFilterFields={[
                  "name",
                  "stock",
                  "weight",
                  "capacity",
                  "concentration",
                  "expiration_date",
                ]}
                onSelectedRow={handleRowSelect}
                loading={loading}
                onReload={fetchProductInventory}
              />
            </div>
          </div>
        </div>
      </div>

      <CustomModal
        title="Detalles del producto"
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
      >
        <ProductInventoryDetail product={selectedProduct?.original} />
      </CustomModal>
      <CustomFormModal
        formId="product-inventory-form"
        title="Editar inventario del producto"
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
      >
        <ProductInventoryForm
          formId="product-inventory-form"
          productId={selectedProduct?.uuid || ""}
          onHandleSubmit={onHandleSubmit}
        />
      </CustomFormModal>
    </>
  );
};
