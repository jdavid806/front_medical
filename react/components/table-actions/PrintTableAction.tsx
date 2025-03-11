import React from 'react';

interface Props {
    onTrigger?: () => void;
}

export const PrintTableAction = ({ onTrigger }: Props) => {
    return (
        <li>
            <a className="dropdown-item"
                href="#"
                onClick={() => onTrigger && onTrigger()}>
                <div className="d-flex gap-2 align-items-center">
                    <i className="fa-solid fa-print" style={{ width: '20px' }}></i>
                    <span>Imprimir</span>
                </div>
            </a>
        </li>
    );
};
