// components/SaveFormButton.tsx
import React from 'react';

interface SaveFormButtonProps {
    getFormConfiguration: () => any;
}

export const SaveFormButton: React.FC<SaveFormButtonProps> = ({ getFormConfiguration }) => (
    <button
        type='button'
        className="btn btn-primary ms-2"
        onClick={() => console.log(getFormConfiguration())}
    >
        Guardar formulario
    </button>
);