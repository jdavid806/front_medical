// WebCreatorTabsSettings.tsx
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { WebCreatorPanel, TabConfig } from '../WebCreatorSplitterEditor';
import { generateUUID } from '../../../services/utilidades';

interface WebCreatorTabsSettingsProps {
    panel: WebCreatorPanel;
    onTabsChange: (panel: WebCreatorPanel) => void;
}

export const WebCreatorTabsSettings: React.FC<WebCreatorTabsSettingsProps> = ({
    panel,
    onTabsChange
}) => {
    const [newTabLabel, setNewTabLabel] = useState('');

    const initializeTabsConfig = (): WebCreatorPanel => {
        if (!panel.tabsConfig) {
            const defaultTabId = generateUUID();
            return {
                ...panel,
                tabsConfig: {
                    tabs: [{
                        id: defaultTabId,
                        label: 'Pestaña 1',
                        content: {
                            uuid: generateUUID(),
                            component: null,
                            children: [],
                            cols: 12,
                            styles: {
                                backgroundColor: '#ffffff',
                                padding: 16,
                                margin: 0,
                                borderRadius: 0
                            }
                        }
                    }],
                    activeTab: defaultTabId
                }
            };
        }
        return panel;
    };

    const addTab = () => {
        if (!newTabLabel.trim()) return;

        const updatedPanel = initializeTabsConfig();
        const newTabId = generateUUID();

        const newTab: TabConfig = {
            id: newTabId,
            label: newTabLabel,
            content: {
                uuid: generateUUID(),
                component: null,
                children: [],
                cols: 12,
                styles: {
                    backgroundColor: '#ffffff',
                    padding: 16,
                    margin: 0,
                    borderRadius: 0
                }
            }
        };

        const updatedTabsConfig = {
            ...updatedPanel.tabsConfig!,
            tabs: [...updatedPanel.tabsConfig!.tabs, newTab]
        };

        onTabsChange({
            ...updatedPanel,
            tabsConfig: updatedTabsConfig
        });

        setNewTabLabel('');
    };

    const removeTab = (tabId: string) => {
        const updatedPanel = initializeTabsConfig();
        const currentTabs = updatedPanel.tabsConfig!.tabs;

        if (currentTabs.length <= 1) return;

        const filteredTabs = currentTabs.filter(tab => tab.id !== tabId);
        let newActiveTab = updatedPanel.tabsConfig!.activeTab;

        // Si eliminamos el tab activo, activamos el primero
        if (newActiveTab === tabId && filteredTabs.length > 0) {
            newActiveTab = filteredTabs[0].id;
        }

        onTabsChange({
            ...updatedPanel,
            tabsConfig: {
                tabs: filteredTabs,
                activeTab: newActiveTab
            }
        });
    };

    const updateTabLabel = (tabId: string, newLabel: string) => {
        const updatedPanel = initializeTabsConfig();
        const updatedTabs = updatedPanel.tabsConfig!.tabs.map(tab =>
            tab.id === tabId ? { ...tab, label: newLabel } : tab
        );

        onTabsChange({
            ...updatedPanel,
            tabsConfig: {
                ...updatedPanel.tabsConfig!,
                tabs: updatedTabs
            }
        });
    };

    const setActiveTab = (tabId: string) => {
        const updatedPanel = initializeTabsConfig();
        onTabsChange({
            ...updatedPanel,
            tabsConfig: {
                ...updatedPanel.tabsConfig!,
                activeTab: tabId
            }
        });
    };

    const tabsConfig = panel.tabsConfig || initializeTabsConfig().tabsConfig;

    return (
        <div className="d-flex flex-column gap-3">
            <h4>Configuración de Tabs</h4>
            <Divider />

            {/* Agregar nueva pestaña */}
            <div className="d-flex gap-2 align-items-end">
                <div className="flex-grow-1">
                    <label htmlFor="newTabLabel" className="block text-sm font-medium mb-2">
                        Nueva Pestaña
                    </label>
                    <InputText
                        id="newTabLabel"
                        value={newTabLabel}
                        onChange={(e) => setNewTabLabel(e.target.value)}
                        placeholder="Nombre de la pestaña"
                        className="w-full"
                    />
                </div>
                <Button
                    icon="fa fa-plus"
                    onClick={addTab}
                    disabled={!newTabLabel.trim()}
                    tooltip="Agregar pestaña"
                />
            </div>

            <Divider />

            {/* Lista de pestañas */}
            <div className="d-flex flex-column gap-2">
                <h5>Pestañas ({tabsConfig?.tabs?.length})</h5>
                {tabsConfig?.tabs?.map((tab) => (
                    <div key={tab.id} className="d-flex gap-2 align-items-center p-2 border-round surface-100">
                        <InputText
                            value={tab.label}
                            onChange={(e) => updateTabLabel(tab.id, e.target.value)}
                            className="flex-grow-1"
                        />
                        <Button
                            icon={`fa fa-${tabsConfig.activeTab === tab.id ? 'check' : 'circle'}`}
                            text
                            severity={tabsConfig.activeTab === tab.id ? "success" : "secondary"}
                            onClick={() => setActiveTab(tab.id)}
                            tooltip="Activar pestaña"
                        />
                        <Button
                            icon="fa fa-trash"
                            text
                            severity="danger"
                            onClick={() => removeTab(tab.id)}
                            disabled={tabsConfig.tabs.length <= 1}
                            tooltip="Eliminar pestaña"
                        />
                    </div>
                ))}
            </div>

            <small className="text-color-secondary">
                Cada pestaña funciona como un contenedor independiente donde puedes agregar componentes.
            </small>
        </div>
    );
};