import React from "react";
import { WebCreatorPanel } from "./WebCreatorSplitterEditor";
import { WebCreatorLogo } from "./components/WebCreatorLogo";
import { WebCreatorMenuBar } from "./components/WebCreatorMenuBar";
import { WebCreatorButton } from "./components/WebCreatorButton";

interface WebCreatorPreviewProps {
    gridConfiguration: {
        rootPanel: WebCreatorPanel;
    };
}

const renderComponent = (component: any) => {
    switch (component.type) {
        case "logo":
            return <WebCreatorLogo component={component} />;
        case "menubar":
            return <WebCreatorMenuBar component={component} />;
        case "button":
            return <WebCreatorButton component={component} />;
        case "sidebar":
            return <div>Sidebar</div>;
        default:
            return <div>Componente no reconocido</div>;
    }
};

const renderPreviewPanel = (panel: WebCreatorPanel) => {
    const hasChildren = panel.children && panel.children.length > 0;
    const hasComponent = panel.component !== null;

    // Calcular ancho basado en columnas
    const widthPercentage = ((panel.cols || 12) / 12) * 100;

    // Aplicar estilos configurados
    const panelStyle: React.CSSProperties = {
        flex: `0 0 ${widthPercentage}%`,
        minWidth: '20px',
        minHeight: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxSizing: 'border-box',
        border: `${panel.styles?.borderWidth || 0}px solid ${panel.styles?.borderColor || '#e5e7eb'}`,
        borderRadius: (panel.styles?.borderRadius || 6) + 'px',
        margin: (panel.styles?.margin || 0) + 'px',
        padding: (panel.styles?.padding || 0) + 'px',
        backgroundColor: panel.styles?.backgroundColor || 'white',
        boxShadow: panel.styles?.boxShadow || 'none'
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: panel.layout === 'vertical' ? 'column' : 'row',
        alignItems: panel.styles?.alignItems || 'center',
        justifyContent: panel.styles?.justifyContent || 'center',
    };

    if (hasChildren) {
        return (
            <div style={panelStyle}>
                <div style={containerStyle}>
                    {panel.children.map(child => (
                        <div key={child.uuid} style={{ flex: `0 0 ${((child.cols || 12) / 12) * 100}%` }}>
                            {renderPreviewPanel(child)}
                        </div>
                    ))}
                </div>
            </div>
        );
    } else if (hasComponent) {
        return (
            <div style={panelStyle}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {renderComponent(panel.component)}
                </div>
            </div>
        );
    } else {
        return (
            <div style={panelStyle}>
                <span style={{ color: '#6B7280', fontSize: '14px' }}>Panel vacío</span>
            </div>
        );
    }
};

export const WebCreatorPreview = ({ gridConfiguration }: WebCreatorPreviewProps) => {
    if (!gridConfiguration || !gridConfiguration.rootPanel) {
        return <div>No hay configuración de grilla para previsualizar</div>;
    }

    return (
        <div className="web-creator-preview" style={{ width: '100%', height: '100%' }}>
            {renderPreviewPanel(gridConfiguration.rootPanel)}
        </div>
    );
};