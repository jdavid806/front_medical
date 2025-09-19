import React from "react";
import { WebCreatorComponent } from "../WebCreatorComponentList";

export const WebCreatorLogo = ({ component }: { component: WebCreatorComponent }) => {
    return (
        <div>
            <img
                style={{
                    width: "100%",
                    height: "70px",
                    objectFit: "contain",
                    objectPosition: "center"
                }}
                src={component.imgSrc}
                alt="Logo"
            />
        </div>
    );
};