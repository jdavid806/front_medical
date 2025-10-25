import React from "react";
import { WebCreatorLogo } from "./components/WebCreatorLogo";
import { WebCreatorMenuBar } from "./components/WebCreatorMenuBar";
import { WebCreatorButton } from "./components/WebCreatorButton";
import { WebCreatorInput } from "./components/WebCreatorInput";
import { WebCreatorComponent } from "./WebCreatorComponentList";

interface WebCreatorComponentViewProps {
    component: WebCreatorComponent;
}

export const WebCreatorComponentView = (props: WebCreatorComponentViewProps) => {
    const { component } = props;
    switch (component.type) {
        case "logo":
            return <WebCreatorLogo component={component} />;
        case "menubar":
            return <WebCreatorMenuBar component={component} />;
        case "button":
            return <WebCreatorButton component={component} />;
        case "sidebar":
            return <div>Sidebar settings</div>;
        case "input":
            return <WebCreatorInput component={component} />;
        default:
            return <div>Unknown component type</div>;
    }
};