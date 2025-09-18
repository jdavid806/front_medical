import React, { useState, useRef } from "react";
import { WebCreatorComponent, WebCreatorComponentList } from "./WebCreatorComponentList";
import { WebCreatorComponentSettings } from "./WebCreatorComponentSettings";
import { Card } from "primereact/card";
import { WebCreatorPanel, WebCreatorSplitterEditor } from "./WebCreatorSplitterEditor";
import { WebCreatorSplitterEditorRef } from "./WebCreatorSplitterEditor";
import { WebCreatorPanelSetting } from "./WebCreatorPanelSetting";

// Componente principal de la aplicación
export const WebCreatorApp = () => {
    const [selectedPanel, setSelectedPanel] = useState<WebCreatorPanel | null>(null);
    const [selectedComponent, setSelectedComponent] = useState<WebCreatorComponent | null>(null);
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

    const addSiblingAbove = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'before');
        }
    };

    const addSiblingBelow = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'after');
        }
    };

    const addSiblingLeft = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'before');
        }
    };

    const addSiblingRight = () => {
        if (selectedPanel) {
            splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'after');
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

    return (
        <div className="d-flex w-100 h-100">
            {/* Panel izquierdo - Lista de componentes */}
            <div
                className="d-flex h-100 overflow-auto px-3"
                style={{
                    minWidth: componentsContainerWidth,
                    width: componentsContainerWidth
                }}>
                <div className="d-flex flex-column h-100 w-100 overflow-auto">
                    {!selectedPanel && (
                        <div className="p-3">
                            <h4>Selecciona un panel para agregar un componente</h4>
                        </div>
                    )}
                    {selectedPanel && (
                        <Card className="h-100">
                            <WebCreatorComponentList
                                onComponentClick={handleSelectComponentFromList}
                            />
                        </Card>
                    )}
                </div>
            </div>

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
            <div
                className="d-flex h-100 overflow-auto px-3"
                style={{
                    minWidth: componentSettingsContainerWidth,
                    width: componentSettingsContainerWidth
                }}>
                <div className="d-flex flex-column h-100 overflow-auto">
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
                            />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};