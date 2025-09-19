import React, { useState, useRef } from "react";
import { WebCreatorComponent, WebCreatorComponentList } from "./WebCreatorComponentList";
import { WebCreatorComponentSettings } from "./WebCreatorComponentSettings";
import { Card } from "primereact/card";
import { WebCreatorPanel, WebCreatorSplitterEditor } from "./WebCreatorSplitterEditor";
import { WebCreatorSplitterEditorRef } from "./WebCreatorSplitterEditor";
import { WebCreatorPanelSetting } from "./WebCreatorPanelSetting";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";

// Componente principal de la aplicación
export const WebCreatorApp = () => {
    const [selectedPanel, setSelectedPanel] = useState<WebCreatorPanel | null>(null);
    const [selectedComponent, setSelectedComponent] = useState<WebCreatorComponent | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const splitterEditorRef = useRef<WebCreatorSplitterEditorRef>(null);

    const componentsContainerWidth = "300px";
    const componentSettingsContainerWidth = "300px";

    const handleSelectComponentFromList = (component: WebCreatorComponent) => {
        if (selectedPanel) {
            splitterEditorRef.current?.addComponentToPanel(selectedPanel, component);
        }
    };

    const handleSelectComponentFromGrid = (component: WebCreatorComponent) => {
        setSelectedComponent(component);
        setSelectedPanel(null);
    };

    const handleSelectPanel = (panel: WebCreatorPanel) => {
        setSelectedPanel(panel);
        setSelectedComponent(null);
    };

    const handleComponentChange = (component: WebCreatorComponent) => {
        setSelectedComponent(component);
        splitterEditorRef.current?.updateComponentInPanel(component);
    };

    const addSiblingAbove = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'above');
        }
    };

    const addSiblingBelow = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'below');
        }
    };

    const addSiblingLeft = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'left');
        }
    };

    const addSiblingRight = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'right');
        }
    };

    const addHorizontalChild = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.addChildPanel(selectedPanel, 'horizontal');
        }
    };

    const addVerticalChild = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.addChildPanel(selectedPanel, 'vertical');
        }
    };

    const removeSelectedPanel = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.removePanel(selectedPanel);
        }
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    // Barra de herramientas superior
    const toolbarLeft = (
        <div className="d-flex align-items-center">
            <span className="font-bold text-lg">Editor de Grilla</span>
        </div>
    );

    const toolbarRight = (
        <div className="d-flex gap-2">
            <Button
                icon={isFullScreen ? <i className="fa fa-compress" /> : <i className="fa fa-expand" />}
                text
                rounded
                onClick={toggleFullScreen}
                tooltip={isFullScreen ? "Salir de pantalla completa" : "Pantalla completa"}
                tooltipOptions={{ position: 'bottom' }}
            />
            {/* Espacio para futuros botones */}
        </div>
    );

    return (
        <div className="d-flex flex-column w-100 h-100">
            {/* Barra de herramientas superior */}
            <div className="border-bottom-1 surface-border mb-3">
                <Toolbar
                    left={toolbarLeft}
                    right={toolbarRight}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'white',
                        border: 'none'
                    }}
                />
            </div>

            {/* Contenido principal */}
            <div className="d-flex flex-grow-1 w-100 h-100">
                {/* Panel izquierdo - Lista de componentes */}
                {!isFullScreen && selectedPanel && (
                    <div
                        className="d-flex h-100 overflow-auto px-3"
                        style={{
                            minWidth: componentsContainerWidth,
                            width: componentsContainerWidth
                        }}>
                        <div className="d-flex flex-column h-100 w-100 overflow-auto">
                            <Card className="h-100">
                                <WebCreatorComponentList
                                    onComponentClick={handleSelectComponentFromList}
                                />
                            </Card>
                        </div>
                    </div>
                )}

                {/* Panel central - Editor con Splitter */}
                <div className="d-flex flex-grow-1 h-100 w-100">
                    <div className="d-flex flex-column h-100 w-100 overflow-auto">
                        <WebCreatorSplitterEditor
                            onPanelClick={handleSelectPanel}
                            onComponentClick={handleSelectComponentFromGrid}
                            ref={splitterEditorRef}
                        />
                    </div>
                </div>

                {/* Panel derecho - Configuración */}
                {!isFullScreen && (
                    <div
                        className="d-flex h-100 overflow-auto px-3"
                        style={{
                            minWidth: componentSettingsContainerWidth,
                            width: componentSettingsContainerWidth
                        }}>
                        <div className="d-flex flex-column h-100 w-100 overflow-auto">
                            {!selectedComponent && !selectedPanel && (
                                <div className="p-3">
                                    <h4>Selecciona un elemento para configurarlo</h4>
                                </div>
                            )}
                            {selectedPanel && (
                                <Card>
                                    <WebCreatorPanelSetting
                                        addSiblingAbove={addSiblingAbove}
                                        addSiblingBelow={addSiblingBelow}
                                        addSiblingLeft={addSiblingLeft}
                                        addSiblingRight={addSiblingRight}
                                        addHorizontalChild={addHorizontalChild}
                                        addVerticalChild={addVerticalChild}
                                        removeSelectedPanel={removeSelectedPanel}
                                    />
                                </Card>
                            )}
                            {selectedComponent && (
                                <Card>
                                    <WebCreatorComponentSettings
                                        selectedComponent={selectedComponent}
                                        onChange={handleComponentChange}
                                    />
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};