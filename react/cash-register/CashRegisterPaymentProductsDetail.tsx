import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CashRegisterProduct } from "./interfaces";
import { formatPrice } from "../../services/utilidades";
import { CashRegisterProductHelper } from "./helpers/CashRegisterProductHelper";

interface CashRegisterPaymentProductsDetailProps {
    products: CashRegisterProduct[];
}

export const CashRegisterPaymentProductsDetail = (props: CashRegisterPaymentProductsDetailProps) => {

    const { products } = props;

    const total = CashRegisterProductHelper.calculateTotal(products);

    const productPriceBodyTemplate = (rowData: CashRegisterProduct) => {
        return formatPrice(rowData.price);
    };

    const productTotalBodyTemplate = (rowData: CashRegisterProduct) => {
        const total = rowData.price * rowData.quantity;
        return <>
            <div className="d-flex justify-content-end">
                <strong>{formatPrice(total)}</strong>
            </div>
        </>;
    };

    return (
        <div className="border-round border-1 surface-border">
            <DataTable
                value={products}
                className="p-datatable-sm p-datatable-gridlines"
                scrollable
                scrollHeight="flex"
                emptyMessage="No se han agregado productos"
                stripedRows
                footer={
                    <div className="d-flex justify-content-between align-items-center p-2">
                        <span className="text-lg fw-bold">Total General:</span>
                        <span className="text-xl fw-bold text-primary">
                            {formatPrice(total)}
                        </span>
                    </div>
                }
            >
                <Column field="description" header="Descripción"></Column>
                <Column
                    field="price"
                    header="Precio Unitario"
                    body={productPriceBodyTemplate}
                ></Column>
                <Column field="quantity" header="Cantidad"></Column>
                <Column
                    field="total"
                    header="Total"
                    body={productTotalBodyTemplate}
                ></Column>
            </DataTable>
        </div>
    )
}