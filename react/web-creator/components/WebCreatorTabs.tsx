// WebCreatorTabs.tsx
import React from 'react';
import { WebCreatorPanel, WebCreatorSplitterEditor } from '../WebCreatorSplitterEditor';
import { WebCreatorComponent } from '../WebCreatorComponentList';

interface WebCreatorTabsProps {
    panel: WebCreatorPanel;
    onPanelClick: (panel: WebCreatorPanel, event: React.MouseEvent) => void;
    onComponentClick: (component: WebCreatorComponent, event: React.MouseEvent) => void;
    onTabChange: (panel: WebCreatorPanel, activeTabId: string) => void;
}

export const WebCreatorTabs: React.FC<WebCreatorTabsProps> = ({
    panel,
    onPanelClick,
    onComponentClick,
    onTabChange
}) => {
    if (!panel.tabsConfig || panel.tabsConfig.tabs.length === 0) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#6B7280',
                border: '1px dashed #e5e7eb',
                borderRadius: '6px'
            }}>
                No hay pestañas configuradas
            </div>
        );
    }

    const { tabs, activeTab } = panel.tabsConfig;
    const activeTabConfig = tabs.find(tab => tab.id === activeTab) || tabs[0];

    const handleTabClick = (tabId: string, event: React.MouseEvent) => {
        onTabChange(panel, tabId);
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* Navegación de tabs */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={(e) => handleTabClick(tab.id, e)}
                        style={{
                            padding: '10px 16px',
                            border: 'none',
                            backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
                            borderBottom: activeTab === tab.id ? '2px solid #3B82F6' : 'none',
                            color: activeTab === tab.id ? '#3B82F6' : '#6B7280',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeTab === tab.id ? '600' : '400',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Contenido del tab activo */}
            <div style={{
                padding: '16px',
                height: 'calc(100% - 49px)', // Restar altura de la navegación
                overflow: 'auto'
            }}>
                {/* <WebCreatorSplitterEditor
                    onPanelClick={(panel, event) => onPanelClick(panel, event)}
                    onComponentClick={(component, event) => onComponentClick(component, event)}
                    // Pasamos la grilla interna del tab activo
                    initialPanel={activeTabConfig.content}
                /> */}
            </div>
        </div>
    );
};