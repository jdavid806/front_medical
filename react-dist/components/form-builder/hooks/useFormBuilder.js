import { useState, useEffect } from 'react';
export const useFormBuilder = () => {
  const [tabs, setTabs] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [newFieldData, setNewFieldData] = useState({
    type: 'text',
    label: '',
    options: ''
  });
  const [currentCard, setCurrentCard] = useState(null);
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
  const initializeForm = formData => {
    const initialFormValues = {};
    const initializedTabs = formData.tabs.map(tab => ({
      ...tab,
      cards: Object.keys(tab).filter(key => key.startsWith('card')).flatMap(key => tab[key]).map(card => ({
        ...card,
        fields: card.fields.map(field => {
          initialFormValues[field.id] = field.type === 'checkbox' ? false : '';
          if (field.type === 'checkbox' && field.toggleFields) {
            field.toggleFields.forEach(subField => {
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