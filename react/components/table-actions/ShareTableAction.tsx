import React from 'react';

interface Props {
    shareType?: 'whatsapp' | 'email';
    onTrigger?: () => void;
}

const actions = {
    whatsapp: {
        label: 'Compartir por Whatsapp',
        icon: 'fa-brands fa-whatsapp',
    },
    email: {
        label: 'Compartir por Correo',
        icon: 'fa-solid fa-envelope',
    }
}

export const ShareTableAction = ({ shareType, onTrigger }: Props) => {

    const action = actions[shareType || 'whatsapp'];

    return (
        <li>
            <a className="dropdown-item"
                href="#"
                onClick={() => onTrigger && onTrigger()}>
                <div className="d-flex gap-2 align-items-center">
                    <i className={action.icon} style={{ width: '20px' }}></i>
                    <span>{action.label}</span>
                </div>
            </a>
        </li>
    );
};
