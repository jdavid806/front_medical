import React from 'react';

interface FormTabsProps {
    tabs: any[];
    activeTab: number;
    setActiveTab: (index: number) => void;
    addNewTab: () => void;
}

export const FormTabs: React.FC<FormTabsProps> = ({ tabs, activeTab, setActiveTab, addNewTab }) => (
    <ul className="nav nav-tabs" id="customTabs">
        {tabs.map((tab, index) => (
            <li key={index} className="nav-item">
                <a
                    className={`nav-link cursor-pointer ${activeTab === index ? 'active' : ''}`}
                    onClick={() => setActiveTab(index)}
                >
                    {tab.tab}
                </a>
            </li>
        ))}
        <li className="nav-item">
            <button className="btn btn-primary ms-2" onClick={addNewTab}>
                Agregar Pestaña
            </button>
        </li>
    </ul>
);