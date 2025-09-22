import React, { forwardRef, useImperativeHandle } from "react";
import { CustomPRTable } from "../../components/CustomPRTable";
import { useSuppliesDeliveries } from "./hooks/useSuppliesDeliveries";
import { SuppliesDeliveriesTableMapper } from "./mappers";
import { Tag } from "primereact/tag";
import { SuppliesDeliveriesTableItem } from "./interfaces";

export const SuppliesDeliveriesTable = forwardRef((props, ref) => {
    const { suppliesDeliveries, fetchSuppliesDeliveries, loading } = useSuppliesDeliveries();

    const tableItems = SuppliesDeliveriesTableMapper.mapToTableItems(suppliesDeliveries);

    useImperativeHandle(ref, () => ({
        refresh: () => fetchSuppliesDeliveries()
    }));

    return (
        <div>
            <CustomPRTable
                columns={[
                    { field: 'type', header: 'Tipo' },
                    {
                        field: 'products', header: 'Insumos', body: (data: SuppliesDeliveriesTableItem) => <>
                            <div className="d-flex flex-column gap-2">
                                {data.products.map(product => <div key={product.id}>
                                    <div>{product.name} (x{product.quantity})</div>
                                </div>)}
                            </div>
                        </>
                    },
                    { field: 'observations', header: 'Observaciones' },
                    {
                        field: 'status', header: 'Estado', body: (data: SuppliesDeliveriesTableItem) => <>
                            <Tag
                                value={data.status.label}
                                severity={data.status.severity}
                            />
                        </>
                    }
                ]}
                data={tableItems}
                loading={loading}
                onReload={fetchSuppliesDeliveries}
            />
        </div>
    );
});