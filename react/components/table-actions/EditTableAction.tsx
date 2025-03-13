import React from 'react';

interface Props {
    onTrigger?: () => void;
}

export const EditTableAction = ({ onTrigger }: Props) => {
    return (
        <li>
            <a className="dropdown-item"
                href="#"
                onClick={() => onTrigger && onTrigger()}>
                <div className="d-flex gap-2 align-items-center">
                    <i className="fa-solid fa-pen" style={{ width: '20px' }}></i>
                    <span>Editar</span>
                </div>
            </a>
        </li>
    );
};
