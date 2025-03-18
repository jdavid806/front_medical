// FormBuilder.tsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DynamicFormTabs } from './components/DynamicFormTabs';
import { DynamicFormCard } from './components/DynamicFormCard';

interface DynamicFormProps {
    form: object | null;
    ref?: React.RefObject<any>;
}

export const DynamicForm: React.FC<DynamicFormProps> = forwardRef(({ form }, ref) => {
    const [tabs, setTabs] = useState<any[]>([]);
    const [formValues, setFormValues] = useState<any>({});
    const [activeTab, setActiveTab] = useState(0);

    useImperativeHandle(ref, () => ({
        getFormValues
    }));

    useEffect(() => {
        if (form) {
            initializeForm(form);
        }
    }, [form]);

    const initializeForm = (formData: any) => {
        console.log(formData);

        const initialFormValues: any = {};
        const initializedTabs = formData.tabs.map((tab: any) => ({
            ...tab,
            cards: Object.keys(tab)
                .filter(key => key.startsWith('card'))
                .flatMap(key => tab[key])
                .map((card: any, index) => ({
                    ...Object.assign(card, { id: `card-${index}` }),
                    fields: card.fields.map((field: any) => {
                        if (formData.values?.[field.id]) {
                            initialFormValues[field.id] = formData.values[field.id];
                            console.log(initialFormValues[field.id]);
                        } else {
                            initialFormValues[field.id] = field.type === 'checkbox' ? false : '';
                        }

                        if (field.type === 'checkbox' && field.toggleFields) {
                            field.toggleFields.forEach((subField: any) => {
                                if (!formData.values?.[subField.id]) {
                                    initialFormValues[subField.id] = '';
                                }
                            });
                        }
                        return field;
                    })
                }))
        }));
        setFormValues(initialFormValues);
        setTabs(initializedTabs);
    };

    const handleEditorChange = (html: string, fieldId: string) => {
        setFormValues((prev: any) => ({ ...prev, [fieldId]: html }));
    };

    const handleInputChange = (fieldId: string, value: string | boolean) => {
        setFormValues((prev: any) => ({ ...prev, [fieldId]: value }));
    };

    const getFormValues = () => {
        return formValues
    }

    return (
        <div className="container-fluid p-3">
            <DynamicFormTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className="tab-content mt-4">
                {tabs.map((tab, tabIndex) => (
                    <div
                        key={tabIndex}
                        className={`tab-pane fade ${activeTab === tabIndex ? 'show active' : ''}`}
                    >
                        <div className="row">
                            {tab.cards?.map((card: any, cardIndex: number) => (
                                <DynamicFormCard
                                    key={cardIndex}
                                    card={card}
                                    formValues={formValues}
                                    onEditorChange={handleEditorChange}
                                    onInputChange={handleInputChange}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});