import { useState, useEffect } from 'react';

export const useFormBuilder = () => {
    const [tabs, setTabs] = useState<any[]>([]);
    const [formValues, setFormValues] = useState<any>({});
    const [activeTab, setActiveTab] = useState(0);
    const [showFieldModal, setShowFieldModal] = useState(false);
    const [newFieldData, setNewFieldData] = useState({ type: 'text', label: '', options: '' });
    const [currentCard, setCurrentCard] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('../../ConsultasJson/formData.json');
                const data = await response.json();
                console.log(data);

                initializeForm(data.form1);
            } catch (error) {
                console.error("Error cargando el JSON:", error);
            }
        };
        fetchData();
    }, []);

    const initializeForm = (formData: any) => {
        const initialFormValues: any = {};
        const initializedTabs = formData.tabs.map((tab: any) => ({
            ...tab,
            cards: Object.keys(tab)
                .filter(key => key.startsWith('card'))
                .flatMap(key => tab[key])
                .map((card: any) => ({
                    ...card,
                    fields: card.fields.map((field: any) => {
                        initialFormValues[field.id] = field.type === 'checkbox' ? false : '';
                        if (field.type === 'checkbox' && field.toggleFields) {
                            field.toggleFields.forEach((subField: any) => {
                                initialFormValues[subField.id] = '';
                            });
                        }
                        return field;
                    })
                }))
        }));
        setFormValues(initialFormValues);
        setTabs(initializedTabs);
    };

    return {
        tabs,
        setTabs,
        formValues,
        setFormValues,
        activeTab,
        setActiveTab,
        showFieldModal,
        setShowFieldModal,
        newFieldData,
        setNewFieldData,
        currentCard,
        setCurrentCard,
        initializeForm
    };
};