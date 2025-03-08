// hooks/useFormActions.ts
import { useFormBuilder } from './useFormBuilder';

export const useFormActions = () => {
    const { tabs, setTabs, formValues, setFormValues, currentCard, newFieldData, setNewFieldData } = useFormBuilder();

    const handleEditorChange = (html: string, fieldId: string) => {
        setFormValues((prev: any) => ({ ...prev, [fieldId]: html }));
    };

    const handleInputChange = (fieldId: string, value: string | boolean) => {
        setFormValues((prev: any) => ({ ...prev, [fieldId]: value }));
    };

    const addNewTab = () => {
        const tabName = prompt('Ingrese el nombre de la nueva pestaña:');
        if (tabName) {
            setTabs(prev => [
                ...prev,
                { tab: tabName, cards: [{ title: 'Nueva Tarjeta', fields: [] }] }
            ]);
        }
    };

    const addNewCard = (tabIndex: number) => {
        const cardName = prompt('Ingrese el nombre de la tarjeta:', 'Nueva Tarjeta');
        if (cardName) {
            setTabs(prev => prev.map((tab, index) =>
                index === tabIndex ? {
                    ...tab,
                    cards: [...tab.cards, { title: cardName, fields: [] }]
                } : tab
            ));
        }
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
        setNewFieldData({ type: 'text', label: '', options: '' });
    };

    return {
        handleEditorChange,
        handleInputChange,
        addNewTab,
        addNewCard,
        handleAddField
    };
};