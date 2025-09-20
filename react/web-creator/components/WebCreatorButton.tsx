import React, { useState } from "react";
import { WebCreatorComponent } from "../WebCreatorComponentList";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { AppointmentFormModal } from "../../appointments/AppointmentFormModal";

export const WebCreatorButton = ({ component }: { component: WebCreatorComponent }) => {

    const [openDialog, setOpenDialog] = useState(false);

    const handleClick = () => {
        console.log(component);
        switch (component.action) {
            case "OPEN_DIALOG":
                setOpenDialog(true);
                break;
            default:
                break;
        }
    };

    const renderDialogComponent = () => {
        switch (component.dialogComponent) {
            default:
                return <>Dialog</>;
        }
    };

    const renderDialog = () => {
        switch (component.dialogComponent) {
            case "SCHEDULE_APPOINTMENT":
                return <AppointmentFormModal isOpen={openDialog} onClose={() => setOpenDialog(false)} />;
            default:
                return <>
                    <Dialog visible={openDialog} onHide={() => setOpenDialog(false)} header="Dialog" position="center">
                        {renderDialogComponent()}
                    </Dialog>
                </>;
        }
    };

    return (
        <div>
            <Button
                label={component.label}
                icon={<i className={component.icon}></i>}
                onClick={handleClick}
            />
            {renderDialog()}
        </div>
    );
};