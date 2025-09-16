import React from "react";

interface TabProps {
    tab: { key: string; label: string };
    activeTab: string | null;
    onActiveTabChange: ((activeTab: string | null) => void) | undefined;
    showCheckIcon: boolean;
}

export const Tab: React.FC<TabProps> = ({ tab, activeTab, onActiveTabChange, showCheckIcon }) => {
    return (
        <>
            <button
                className={`w-100 p-3 btn btn-outline-primary ${activeTab === tab.key ? "btn-primary text-white" : ""
                    } btn-sm`}
                onClick={() => {
                    if (activeTab === tab.key) {
                        onActiveTabChange?.(null);
                        return;
                    }
                    onActiveTabChange?.(tab.key);
                }}
            >
                <div className="d-flex align-items-center gap-2">
                    <div className={showCheckIcon ? "d-block" : "d-none"}>
                        <i
                            className={`fas fa-check-circle`}
                            style={{ width: "20px", height: "20px" }}
                        />
                    </div>
                    {tab.label}
                </div>
            </button>
        </>
    );
};