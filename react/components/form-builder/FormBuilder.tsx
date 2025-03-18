// FormBuilder.tsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FormTabs } from './components/FormTabs';
import { FormCard } from './components/FormCard';
import { AddFieldModal } from './components/AddFieldModal';

interface FormBuilderProps {
    form: object | null;
    ref?: React.RefObject<any>;
}

export const FormBuilder: React.FC<FormBuilderProps> = forwardRef(({ form }, ref) => {
    const [tabs, setTabs] = useState<any[]>([]);
    const [formValues, setFormValues] = useState<any>({});
    const [activeTab, setActiveTab] = useState(0);
    const [showFieldModal, setShowFieldModal] = useState(false);
    const [newFieldData, setNewFieldData] = useState({ type: 'text', label: '', options: '' });
    const [currentCard, setCurrentCard] = useState<any>(null);

    useImperativeHandle(ref, () => ({
        getFormConfiguration
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
                        console.log(field);
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
        console.log('Initial form values:', initialFormValues);
        setFormValues(initialFormValues);
        setTabs(initializedTabs);
    };

    const handleEditorChange = (html: string, fieldId: string) => {
        setFormValues((prev: any) => ({ ...prev, [fieldId]: html }));
    };

    const handleInputChange = (fieldId: string, value: string | boolean) => {
        setFormValues((prev: any) => ({ ...prev, [fieldId]: value }));
    };

    const addNewTab = () => {
        const tabName = prompt('Ingrese el nombre de la nueva pestañaa:');
        if (tabName) {
            setTabs(prev => [
                ...prev,
                { tab: tabName, cards: [{ title: 'Nueva Tarjeta', fields: [] }] }
            ]);
            setActiveTab(tabs.length);
        }
    };

    const addNewCard = (tabIndex: number) => {
        const cardName = prompt('Ingrese el nombre de la tarjeta:', 'Nueva Tarjeta');
        if (cardName) {
            const newCard = {
                id: `card-${Date.now()}`,
                title: cardName,
                fields: []
            };

            setTabs(prev => prev.map((tab, index) =>
                index === tabIndex ? {
                    ...tab,
                    cards: [...tab.cards, newCard]
                } : tab
            ));
        }
    };

    const deleteCard = (cardId: string) => {
        setTabs(prev => prev.map(tab => ({
            ...tab,
            cards: tab.cards.filter((card: any) => card.id !== cardId)
        })));
    };

    const handleAddField = () => {
        const newField = {
            id: `field-${Date.now()}`,
            label: newFieldData.label,
            type: newFieldData.type,
            ...(newFieldData.type === 'select' && {
                options: newFieldData.options.split(',').map((opt: string) => ({
                    value: opt.trim(),
                    text: opt.trim()
                }))
            }),
            ...(newFieldData.type === 'checkbox' && {
                toggleFields: [{
                    type: 'textarea',
                    id: `subfield-${Date.now()}`,
                    label: '',
                    placeholder: newFieldData.label
                }]
            })
        };

        setTabs(prev => prev.map(tab => ({
            ...tab,
            cards: tab.cards.map(card =>
                card === currentCard ? {
                    ...card,
                    fields: [...card.fields, newField]
                } : card
            )
        })));
        setShowFieldModal(false);
        setNewFieldData({ type: 'text', label: '', options: '' });
    };

    const deleteField = (fieldId: string) => {
        setTabs(prev => prev.map(tab => ({
            ...tab,
            cards: tab.cards.map(card => ({
                ...card,
                fields: card.fields.filter((field: any) => field.id !== fieldId)
            }))
        })));
    };

    const getFormConfiguration = () => ({
        tabs: tabs.map(tab => ({
            tab: tab.tab,
            cards: tab.cards.map(card => ({
                title: card.title,
                fields: card.fields.map((field: any) => ({
                    ...field,
                    value: formValues[field.id]
                }))
            }))
        })),
        values: formValues
    });

    return (
        <div className="container-fluid p-3">
            <FormTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                addNewTab={addNewTab}
            />

            <div className="tab-content mt-4">
                {tabs.map((tab, tabIndex) => (
                    <div
                        key={tabIndex}
                        className={`tab-pane fade ${activeTab === tabIndex ? 'show active' : ''}`}
                    >
                        <div className="row">
                            {tab.cards?.map((card: any, cardIndex: number) => (
                                <FormCard
                                    key={cardIndex}
                                    card={card}
                                    formValues={formValues}
                                    onDeleteCard={deleteCard}
                                    onAddField={() => {
                                        setCurrentCard(card);
                                        setShowFieldModal(true);
                                    }}
                                    onDeleteField={deleteField}
                                    onEditorChange={handleEditorChange}
                                    onInputChange={handleInputChange}
                                />
                            ))}
                        </div>
                        <div className="text-center mt-3">
                            <button
                                type='button'
                                className="btn btn-primary"
                                onClick={() => addNewCard(tabIndex)}
                            >
                                Agregar Tarjeta
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AddFieldModal
                show={showFieldModal}
                newFieldData={newFieldData}
                onHide={() => setShowFieldModal(false)}
                onSubmit={handleAddField}
                onFieldDataChange={setNewFieldData}
            />
        </div>
    );
});