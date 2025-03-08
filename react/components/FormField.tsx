// FormField.tsx
import React from 'react';
import { Editor } from 'primereact/editor';

interface FormFieldProps {
    field: any;
    formValues: any;
    onEditorChange: (html: string, fieldId: string) => void;
    onInputChange: (fieldId: string, value: string | boolean) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
    field,
    formValues,
    onEditorChange,
    onInputChange
}) => {
    switch (field.type) {
        case 'textarea':
            return (
                <>
                    <label htmlFor={field.id} className='form-label'>{field.label}</label>
                    <Editor
                        value={formValues[field.id] || ''}
                        onTextChange={(e) => onEditorChange(e.htmlValue ?? '', field.id)}
                        style={{ height: '150px' }}
                    />
                </>
            );

        case 'select':
            return (
                <div className="mb-3 form-floating">
                    <select
                        className="form-select"
                        id={field.id}
                        value={formValues[field.id] || ''}
                        onChange={(e) => onInputChange(field.id, e.target.value)}
                    >
                        <option value="" disabled>Seleccione</option>
                        {field.options.map((opt: any, i: number) => (
                            <option key={i} value={opt.value}>{opt.text}</option>
                        ))}
                    </select>
                    <label htmlFor={field.id}>{field.label}</label>
                </div>
            );

        case 'checkbox':
            return (
                <div className="form-check mb-3 p-0">
                    <div className="d-flex gap-2 align-items-center form-check form-switch mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={field.id}
                            checked={formValues[field.id] || false}
                            onChange={(e) => onInputChange(field.id, e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor={field.id}>{field.label}</label>
                    </div>
                    {formValues[field.id] && field.toggleFields?.map((subField: any) => (
                        <div key={subField.id}>
                            {subField.type === 'textarea' ? (
                                <>
                                    <label htmlFor={subField.id} className='form-label'>{subField.label}</label>
                                    <Editor
                                        value={formValues[subField.id] || ''}
                                        onTextChange={(e) => onEditorChange(e.htmlValue ?? '', subField.id)}
                                        style={{ height: '100px' }}
                                    />
                                </>
                            ) : (
                                <input
                                    type="text"
                                    className="form-control"
                                    id={subField.id}
                                    placeholder={subField.placeholder}
                                    value={formValues[subField.id] || ''}
                                    onChange={(e) => onInputChange(subField.id, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            );

        case 'number':
            return (
                <div className="mb-3 form-floating">
                    <input
                        type="number"
                        className="form-control"
                        id={field.id}
                        value={formValues[field.id] || ''}
                        onChange={(e) => onInputChange(field.id, e.target.value)}
                    />
                    <label htmlFor={field.id}>{field.label}</label>
                </div>
            );

        default:
            return (
                <div className="mb-3 form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id={field.id}
                        value={formValues[field.id] || ''}
                        onChange={(e) => onInputChange(field.id, e.target.value)}
                    />
                    <label htmlFor={field.id}>{field.label}</label>
                </div>
            );
    }
};