// hooks/useFormActions.ts
import { useFormBuilder } from "./useFormBuilder.js";
export const useFormActions = () => {
  const {
    tabs,
    setTabs,
    formValues,
    setFormValues,
    currentCard,
    newFieldData,
    setNewFieldData
  } = useFormBuilder();
  const handleEditorChange = (html, fieldId) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: html
    }));
  };
  const handleInputChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };
  const addNewTab = () => {
    const tabName = prompt('Ingrese el nombre de la nueva pestaña:');
    if (tabName) {
      setTabs(prev => [...prev, {
        tab: tabName,
        cards: [{
          title: 'Nueva Tarjeta',
          fields: []
        }]
      }]);
    }
  };
  const addNewCard = tabIndex => {
    const cardName = prompt('Ingrese el nombre de la tarjeta:', 'Nueva Tarjeta');
    if (cardName) {
      setTabs(prev => prev.map((tab, index) => index === tabIndex ? {
        ...tab,
        cards: [...tab.cards, {
          title: cardName,
          fields: []
        }]
      } : tab));
    }
  };
  const handleAddField = () => {
    const newField = {
      id: `field-${Date.now()}`,
      label: newFieldData.label,
      type: newFieldData.type,
      ...(newFieldData.type === 'select' && {
        options: newFieldData.options.split(',').map(opt => ({
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
      cards: tab.cards.map(card => card === currentCard ? {
        ...card,
        fields: [...card.fields, newField]
      } : card)
    })));
    setNewFieldData({
      type: 'text',
      label: '',
      options: ''
    });
  };
  return {
    handleEditorChange,
    handleInputChange,
    addNewTab,
    addNewCard,
    handleAddField
  };
};