import React, { useState, useEffect } from 'react';
import { DynamicFormCardSummary } from './components/DynamicFormCardSummary';
import { DynamicFormTabs } from '../dynamic-form/components/DynamicFormTabs';

interface DynamicFormSummaryProps {
    form: object | null;
}

export const DynamicFormSummary: React.FC<DynamicFormSummaryProps> = ({ form }) => {
    const [tabs, setTabs] = useState<any[]>([]);
    const [formValues, setFormValues] = useState<any>({});
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (form) {
            initializeForm(form);
        }
    }, [form]);

    const initializeForm = (formData: any) => {
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
                        } else {
                            initialFormValues[field.id] = field.type === 'checkbox' ? false : '';
                        }

                        if (field.type === 'checkbox' && field.toggleFields) {
                            field.toggleFields.forEach((subField: any) => {
                                if (!formData.values?.[subField.id]) {
                                    initialFormValues[subField.id] = '';
                                } else {
                                    initialFormValues[subField.id] = formData.values[subField.id];
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
                                <DynamicFormCardSummary
                                    key={cardIndex}
                                    card={card}
                                    formValues={formValues}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};