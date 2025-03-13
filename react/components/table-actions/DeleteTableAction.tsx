import React from 'react';

interface Props {
    onTrigger?: () => void;
}

export const DeleteTableAction = ({ onTrigger }: Props) => {
    return (
        <li>
            <a className="dropdown-item"
                href="#"
                onClick={() => onTrigger && onTrigger()}>
                <div className="d-flex gap-2 align-items-center">
                    <i className="fa-solid fa-trash" style={{ width: '20px' }}></i>
                    <span>Eliminar</span>
                </div>
            </a>
        </li>
    );
};
