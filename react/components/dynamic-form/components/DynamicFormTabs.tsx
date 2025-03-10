import React from 'react';

interface DynamicFormTabsProps {
    tabs: any[];
    activeTab: number;
    setActiveTab: (index: number) => void;
}

export const DynamicFormTabs: React.FC<DynamicFormTabsProps> = ({ tabs, activeTab, setActiveTab }) => (
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
    </ul>
);