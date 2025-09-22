import { Divider } from "primereact/divider";
import React from "react";
import { WebCreatorPanel } from "./WebCreatorSplitterEditor";
import { MenuItem } from "primereact/menuitem";
import { generateUUID } from "../../services/utilidades";

export interface WebCreatorComponent {
    uuid: string;
    name: string;
    type: string;
    label?: string;
    icon?: string;
    imgSrc?: string;
    menuItems?: MenuItem[];
    action?: string;
    dialogComponent?: string;
    controlType?: "text" | "number" | "dropdown"
    panel?: WebCreatorPanel;
}

interface WebCreatorComponentListProps {
    onComponentClick: (component: WebCreatorComponent) => void;
}

export const WebCreatorComponentList = ({ onComponentClick }: WebCreatorComponentListProps) => {

    const [selectedComponent, setSelectedComponent] = React.useState<WebCreatorComponent | null>(null);

    const components: WebCreatorComponent[] = [
        {
            uuid: "1",
            name: "Logo",
            type: "logo",
            imgSrc: "assets/img/logos/FullColor.svg"
        },
        {
            uuid: "2",
            name: "Menubar",
            type: "menubar",
            imgSrc: "assets/img/logos/FullColor.svg",
            menuItems: [
                { label: 'Home', icon: <i className="fa fa-home"></i> },
                { label: 'About', icon: <i className="fa fa-info"></i> },
                { label: 'Contact', icon: <i className="fa fa-phone"></i> }
            ]
        },
        {
            uuid: "3",
            name: "Botón agendar",
            type: "button",
            action: "OPEN_DIALOG",
            dialogComponent: "SCHEDULE_APPOINTMENT",
            label: "Agendar una cita",
            icon: "fa fa-calendar"
        },
        {
            uuid: "4",
            name: "Sidebar",
            type: "sidebar",
            imgSrc: "assets/img/logos/FullColor.svg"
        },
        {
            uuid: "5",
            name: "Banner",
            type: "banner",
            imgSrc: "assets/img/logos/FullColor.svg"
        },
        {
            uuid: "6",
            name: "Content",
            type: "content",
            imgSrc: "assets/img/logos/FullColor.svg"
        },
        {
            uuid: "7",
            name: "Footer",
            type: "footer",
            imgSrc: "assets/img/logos/FullColor.svg"
        },
        {
            uuid: generateUUID(),
            name: "Campo de texto",
            type: "input",
            label: "Campo de texto",
            icon: "",
            controlType: "text"
        }
    ];

    return (
        <div>
            <h3>Componentes</h3>
            <Divider />
            <div className="d-flex flex-column gap-2">
                {components.map((component) => (
                    <div
                        key={component.uuid}
                        onClick={() => {
                            setSelectedComponent(component);
                            onComponentClick(component);
                        }}
                        className={selectedComponent?.uuid === component.uuid ? "cursor-pointer border border-1 border-primary" : "cursor-pointer"}
                    >
                        <p>{component.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};