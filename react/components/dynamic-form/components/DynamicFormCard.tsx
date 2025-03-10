// FormCard.tsx
import React from 'react';
import { FormField } from '../../form-builder/components/FormField';

interface DynamicFormCardProps {
    card: any;
    formValues: any;
    onEditorChange: (html: string, fieldId: string) => void;
    onInputChange: (fieldId: string, value: string | boolean) => void;
}

export const DynamicFormCard: React.FC<DynamicFormCardProps> = ({
    card,
    formValues,
    onEditorChange,
    onInputChange
}) => (
    <div className="col mb-3">
        <div className="card h-100">
            <div className="card-body">
                <div className="d-flex flex-column mb-3 w-100">
                    <h5 className="card-title">{card.title}</h5>
                </div>
                {card.fields?.map((field: any, index) => (
                    <div key={index} className="d-flex flex-column mb-3 w-100">
                        <FormField
                            field={field}
                            formValues={formValues}
                            onEditorChange={onEditorChange}
                            onInputChange={onInputChange}
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
);