import React, { useRef, useState } from "react";
import { MenuItem } from "primereact/menuitem";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { SuppliesDeliveryFormModal } from "./SuppliesDeliveryFormModal";

export const SuppliesDeliveries = () => {

    const [showRequestDialog, setShowRequestDialog] = useState(false);

    const requestSupplyMenu = useRef<Menu>(null);

    const requestSupplyMenuItems: MenuItem[] = [
        {
            label: 'Administrativo',
            command: () => {
                setShowRequestDialog(true);
            }
        }
    ]

    return (
        <div>
            <div className="d-flex">
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

            <SuppliesDeliveryFormModal visible={showRequestDialog} onHide={() => setShowRequestDialog(false)} />
        </div>
    );
};

