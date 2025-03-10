// FormCard.tsx
import React from 'react';
import { FormField } from './FormField';

interface FormCardProps {
    card: any;
    formValues: any;
    onDeleteCard: (cardId: string) => void;
    onAddField: (card: any) => void;
    onDeleteField: (fieldId: string) => void;
    onEditorChange: (html: string, fieldId: string) => void;
    onInputChange: (fieldId: string, value: string | boolean) => void;
}

export const FormCard: React.FC<FormCardProps> = ({
    card,
    formValues,
    onDeleteCard,
    onAddField,
    onDeleteField,
    onEditorChange,
    onInputChange
}) => (
    <div className="col mb-3">
        <div className="card h-100">
            <div className="card-body">
                <div className="d-flex p-2 align-self-start cursor-pointer">
                    <div className='text-danger' onClick={() => onDeleteCard(card.id)}>
                        <i className="fas fa-trash"></i>
                    </div>
                </div>
                <div className="d-flex flex-column mb-3 w-100">
                    <h5 className="card-title">{card.title}</h5>
                </div>
                {card.fields?.map((field: any, fieldIndex: number) => (
                    <div className='d-flex' key={fieldIndex}>
                        <div className="d-flex p-2 align-self-start cursor-pointer">
                            <div className='text-danger' onClick={() => onDeleteField(field.id)}>
                                <i className="fas fa-trash"></i>
                            </div>
                        </div>
                        <div className="d-flex flex-column mb-3 w-100">
                            <FormField
                                field={field}
                                formValues={formValues}
                                onEditorChange={onEditorChange}
                                onInputChange={onInputChange}
                            />
                        </div>
                    </div>
                ))}
                <button
                    type='button'
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() => onAddField(card)}
                >
                    Agregar Campo
                </button>
            </div>
        </div>
    </div>
);