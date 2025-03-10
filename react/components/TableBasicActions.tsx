import React from 'react';

interface TableBasicActionsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    extraActions?: React.ReactNode;
}

export const TableBasicActions = ({ onEdit, onDelete, extraActions }: TableBasicActionsProps) => {
    return (
        <div className="text-end align-middle">
            <div className="dropdown">
                <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i data-feather="settings"></i> Acciones
                </button>
                <ul className="dropdown-menu" style={{ zIndex: 10000 }}>
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            if (onEdit) onEdit();
                        }} data-column="editar">
                            <div className="d-flex gap-2 align-items-center">
                                <i className="fa-solid fa-pen" style={{ width: '20px' }}></i>
                                <span>Editar</span>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            if (onDelete) onDelete();
                        }} data-column="eliminar">
                            <div className="d-flex gap-2 align-items-center">
                                <i className="fa-solid fa-trash" style={{ width: '20px' }}></i>
                                <span>Eliminar</span>
                            </div>
                        </a>
                    </li>
                    {extraActions}
                </ul>
            </div>
        </div>
    );
};
