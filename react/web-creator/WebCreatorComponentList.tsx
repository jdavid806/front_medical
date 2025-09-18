import { Divider } from "primereact/divider";
import React from "react";

export interface WebCreatorComponent {
    uuid: string;
    name: string;
    type: string;
    imgSrc: string;
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
            imgSrc: "https://via.placeholder.com/150"
        },
        {
            uuid: "2",
            name: "Menubar",
            type: "menubar",
            imgSrc: "https://via.placeholder.com/150"
        },
        {
            uuid: "3",
            name: "Botón agendar",
            type: "button",
            imgSrc: "https://via.placeholder.com/150"
        },
        {
            uuid: "4",
            name: "Sidebar",
            type: "sidebar",
            imgSrc: "https://via.placeholder.com/150"
        },
        {
            uuid: "5",
            name: "Banner",
            type: "banner",
            imgSrc: "https://via.placeholder.com/150"
        },
        {
            uuid: "6",
            name: "Content",
            type: "content",
            imgSrc: "https://via.placeholder.com/150"
        },
        {
            uuid: "7",
            name: "Footer",
            type: "footer",
            imgSrc: "https://via.placeholder.com/150"
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