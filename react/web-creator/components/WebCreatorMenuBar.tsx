import React from "react";
import { WebCreatorComponent } from "../WebCreatorComponentList";
import { Menubar } from "primereact/menubar";
import { navbarMenuStyle } from "../../layout/menu/styles/navBarMegaMenu";

export const WebCreatorMenuBar = ({ component }: { component: WebCreatorComponent }) => {
    return (
        <div>
            <Menubar
                model={component.menuItems}
                className="custom-responsive-megamenu"
            />
            <style>{navbarMenuStyle}</style>
        </div>
    );
};