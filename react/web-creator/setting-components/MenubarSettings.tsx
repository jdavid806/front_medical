import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { WebCreatorComponent } from "../WebCreatorComponentList";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MenubarTreeSettings } from "./MenubarTreeSettings";

interface MenubarSettingsProps {
    component: WebCreatorComponent;
    onChange: (component: WebCreatorComponent) => void;
}

export const MenubarSettings = ({ component, onChange }: MenubarSettingsProps) => {
    const [showMenuItemsDialog, setShowMenuItemsDialog] = useState(false);

    // Asegurarnos de que menuItems siempre sea un array
    const menuItems = component.menuItems || [];

    const handleMenuItemsChange = (newMenuItems: any[]) => {
        onChange({
            ...component,
            menuItems: newMenuItems
        });
    };

    return (
        <>
            <div className="d-flex flex-column gap-3">
                <div className="d-flex flex-column">
                    <Button
                        label="Configurar Items del Menú"
                        icon="pi pi-cog"
                        onClick={() => setShowMenuItemsDialog(true)}
                    />
                </div>

                <div className="d-flex flex-column">
                    <small className="text-muted">
                        {menuItems.length} items del menú configurados
                    </small>
                </div>
            </div>

            <Dialog
                visible={showMenuItemsDialog}
                onHide={() => setShowMenuItemsDialog(false)}
                header="Configurar Items del Menú"
                position="center"
                style={{ width: '80vw', maxWidth: '1200px' }}
                modal
                className="menu-items-dialog"
            >
                <div className="p-fluid">
                    <MenubarTreeSettings
                        menuItems={menuItems}
                        onMenuItemsChange={handleMenuItemsChange}
                    />
                </div>
            </Dialog>
        </>
    );
};