import React from 'react';

interface FormFieldSummaryProps {
    field: any;
    formValues: any;
}

export const FormFieldSummary: React.FC<FormFieldSummaryProps> = ({
    field,
    formValues
}) => {
    const getDisplayValue = (field: any, value: any) => {
        if (!value && value !== false && value !== 0) return 'No especificado';

        switch (field.type) {
            case 'textarea':
                return (
                    <div className="border rounded p-3 bg-light">
                        <div
                            className="form-summary-html-content"
                            dangerouslySetInnerHTML={{ __html: value || '' }}
                        />
                    </div>
                );

            case 'select':
                const selectedOption = field.options?.find((opt: any) => opt.value === value);
                return selectedOption?.text || value;

            case 'checkbox':
                return (
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-2">
                            <span className={`badge ${value ? 'bg-success' : 'bg-secondary'}`}>
                                {value ? 'Sí' : 'No'}
                            </span>
                            <span>{field.label}</span>
                        </div>
                        {value && field.toggleFields?.map((subField: any) => (
                            <div key={subField.id} className="ms-3 border-start ps-3">
                                <small className="text-muted d-block">{subField.label}:</small>
                                <div className="mt-1">
                                    {subField.type === 'textarea' ? (
                                        <div className="border rounded p-2 bg-light small">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: formValues[subField.id] || 'No especificado'
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <span className="fw-semibold">
                                            {formValues[subField.id] || 'No especificado'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'number':
                return new Intl.NumberFormat().format(Number(value));

            default:
                return value;
        }
    };

    return (
        <div className="form-field-summary">
            {field.type !== 'checkbox' && (
                <label className="form-label fw-semibold text-muted mb-2">
                    {field.label}
                </label>
            )}
            <div className="form-summary-value">
                {getDisplayValue(field, formValues[field.id])}
            </div>
        </div>
    );
};