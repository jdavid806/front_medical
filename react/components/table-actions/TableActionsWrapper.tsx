import React from 'react';

interface TableActionsWrapperProps {
    children: React.ReactNode;
}

const TableActionsWrapper: React.FC<TableActionsWrapperProps> = ({ children }) => {
    return (
        <div className="dropdown" style={{ marginBottom: '10px' , marginTop: '10px'}}>
            <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i data-feather="settings"></i> Acciones
            </button>
            <ul className="dropdown-menu">
                {children}
            </ul>
        </div>
    );
};

export default TableActionsWrapper;

