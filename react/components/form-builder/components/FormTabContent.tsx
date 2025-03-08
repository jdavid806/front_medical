// components/FormTabContent.tsx
import React from 'react';
import { FormCard } from './FormCard';

interface FormTabContentProps {
    tab: any;
    tabIndex: number;
    formValues: any;
    onAddField: (card: any) => void;
    onEditorChange: (html: string, fieldId: string) => void;
    onInputChange: (fieldId: string, value: string | boolean) => void;
    onAddCard: (tabIndex: number) => void;
}

export const FormTabContent: React.FC<FormTabContentProps> = ({
    tab,
    tabIndex,
    formValues,
    onAddField,
    onEditorChange,
    onInputChange,
    onAddCard
}) => (
    <div className={`tab-pane fade ${tabIndex}`}>
        <div className="row">
            {tab.cards?.map((card: any, cardIndex: number) => (
                <FormCard
                    key={cardIndex}
                    card={card}
                    formValues={formValues}
                    onAddField={onAddField}
                    onEditorChange={onEditorChange}
                    onInputChange={onInputChange}
                />
            ))}
        </div>
        <div className="text-center mt-3">
            <button
                className="btn btn-primary"
                onClick={() => onAddCard(tabIndex)}
            >
                Agregar Tarjeta
            </button>
        </div>
    </div>
);