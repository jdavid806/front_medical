// FormBuilder.tsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FormTabs } from "./components/FormTabs.js";
import { FormCard } from "./components/FormCard.js";
import { AddFieldModal } from "./components/AddFieldModal.js";
export const FormBuilder = /*#__PURE__*/forwardRef(({
  form
}, ref) => {
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
  useImperativeHandle(ref, () => ({
    getFormConfiguration
  }));
  useEffect(() => {
    if (form) {
      initializeForm(form);
    }
  }, [form]);
  const initializeForm = formData => {
    console.log(formData);
    const initialFormValues = {};
    const initializedTabs = formData.tabs.map(tab => ({
      ...tab,
      cards: Object.keys(tab).filter(key => key.startsWith('card')).flatMap(key => tab[key]).map((card, index) => ({
        ...Object.assign(card, {
          id: `card-${index}`
        }),
        fields: card.fields.map(field => {
          console.log(field);
          if (formData.values?.[field.id]) {
            initialFormValues[field.id] = formData.values[field.id];
            console.log(initialFormValues[field.id]);
          } else {
            initialFormValues[field.id] = field.type === 'checkbox' ? false : '';
          }
          if (field.type === 'checkbox' && field.toggleFields) {
            field.toggleFields.forEach(subField => {
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
    const tabName = prompt('Ingrese el nombre de la nueva pestañaa:');
    if (tabName) {
      setTabs(prev => [...prev, {
        tab: tabName,
        cards: [{
          title: 'Nueva Tarjeta',
          fields: []
        }]
      }]);
      setActiveTab(tabs.length);
    }
  };
  const addNewCard = tabIndex => {
    const cardName = prompt('Ingrese el nombre de la tarjeta:', 'Nueva Tarjeta');
    if (cardName) {
      const newCard = {
        id: `card-${Date.now()}`,
        title: cardName,
        fields: []
      };
      setTabs(prev => prev.map((tab, index) => index === tabIndex ? {
        ...tab,
        cards: [...tab.cards, newCard]
      } : tab));
    }
  };
  const deleteCard = cardId => {
    setTabs(prev => prev.map(tab => ({
      ...tab,
      cards: tab.cards.filter(card => card.id !== cardId)
    })));
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
    setShowFieldModal(false);
    setNewFieldData({
      type: 'text',
      label: '',
      options: ''
    });
  };
  const deleteField = fieldId => {
    setTabs(prev => prev.map(tab => ({
      ...tab,
      cards: tab.cards.map(card => ({
        ...card,
        fields: card.fields.filter(field => field.id !== fieldId)
      }))
    })));
  };
  const getFormConfiguration = () => ({
    tabs: tabs.map(tab => ({
      tab: tab.tab,
      cards: tab.cards.map(card => ({
        title: card.title,
        fields: card.fields.map(field => ({
          ...field,
          value: formValues[field.id]
        }))
      }))
    })),
    values: formValues
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-3"
  }, /*#__PURE__*/React.createElement(FormTabs, {
    tabs: tabs,
    activeTab: activeTab,
    setActiveTab: setActiveTab,
    addNewTab: addNewTab
  }), /*#__PURE__*/React.createElement("div", {
    className: "tab-content mt-4"
  }, tabs.map((tab, tabIndex) => /*#__PURE__*/React.createElement("div", {
    key: tabIndex,
    className: `tab-pane fade ${activeTab === tabIndex ? 'show active' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, tab.cards?.map((card, cardIndex) => /*#__PURE__*/React.createElement(FormCard, {
    key: cardIndex,
    card: card,
    formValues: formValues,
    onDeleteCard: deleteCard,
    onAddField: () => {
      setCurrentCard(card);
      setShowFieldModal(true);
    },
    onDeleteField: deleteField,
    onEditorChange: handleEditorChange,
    onInputChange: handleInputChange
  }))), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => addNewCard(tabIndex)
  }, "Agregar Tarjeta"))))), /*#__PURE__*/React.createElement(AddFieldModal, {
    show: showFieldModal,
    newFieldData: newFieldData,
    onHide: () => setShowFieldModal(false),
    onSubmit: handleAddField,
    onFieldDataChange: setNewFieldData
  }));
});