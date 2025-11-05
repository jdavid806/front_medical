import React from 'react';
import { FormFieldSummary } from './FormFieldSummary';

interface DynamicFormCardSummaryProps {
    card: any;
    formValues: any;
}

export const DynamicFormCardSummary: React.FC<DynamicFormCardSummaryProps> = ({
    card,
    formValues
}) => (
    <div className="col mb-3">
        <div className="card h-100">
            <div className="card-body">
                <div className="d-flex flex-column mb-3 w-100">
                    <h5 className="card-title">{card.title}</h5>
                </div>
                {card.fields?.map((field: any, index: number) => (
                    <div key={index} className="d-flex flex-column mb-3 w-100">
                        <FormFieldSummary
                            field={field}
                            formValues={formValues}
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
);