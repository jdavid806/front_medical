import React, { useRef, useState } from "react";
import { MenuItem } from "primereact/menuitem";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { SuppliesDeliveryFormModal } from "./SuppliesDeliveryFormModal";
import { SuppliesDeliveriesTable } from "./SuppliesDeliveriesTable";
import { SuppliesDeliveriesTableRef } from "./interfaces";

export const SuppliesDeliveries = () => {

    const [showRequestDialog, setShowRequestDialog] = useState(false);

    const requestSupplyMenu = useRef<Menu>(null);
    const tableRef = useRef<SuppliesDeliveriesTableRef>(null);

    const requestSupplyMenuItems: MenuItem[] = [
        {
            label: 'Administrativo',
            command: () => {
                setShowRequestDialog(true);
            }
        }
    ]

    const handleSave = () => {
        tableRef.current?.refresh();
    }

    return (
        <div>
            <div className="d-flex flex-column gap-2">
                <div className="d-flex gap-2">
                    <Menu
                        model={requestSupplyMenuItems}
                        popup
                        ref={requestSupplyMenu}
                        id="popup_menu_left"
                    />
                    <Button
                        label="Solicitar Insumos"
                        icon={<i className="fas fa-plus me-2"></i>}
                        onClick={(event) => requestSupplyMenu.current?.toggle(event)}
                        className="btn btn-primary"
                        aria-controls="popup_menu_left"
                        aria-haspopup
                    />
                </div>
                <SuppliesDeliveriesTable ref={tableRef} />
            </div>

            <SuppliesDeliveryFormModal
                visible={showRequestDialog}
                onHide={() => setShowRequestDialog(false)}
                onSave={handleSave}
            />
        </div>
    );
};

