import React, { useState, useEffect } from 'react';
import { Editor } from 'primereact/editor';
import { CustomModal } from "../components/CustomModal";

export const FormBuilder = () => {
    const [tabs, setTabs] = useState<any[]>([]);
    const [formValues, setFormValues] = useState<any>({});
    const [activeTab, setActiveTab] = useState(0);
    const [showFieldModal, setShowFieldModal] = useState(false);
    const [newFieldData, setNewFieldData] = useState({ type: 'text', label: '', options: '' });
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

    const initializeForm = (formData) => {
        const initialFormValues = {};

        const initializedTabs = formData.tabs.map(tab => {
            // Procesar todas las cards
            const cards = Object.keys(tab)
                .filter(key => key.startsWith('card'))
                .flatMap(key => tab[key]) // Aplanar todos los arrays de cards
                .map(card => {
                    // Procesar campos y sus valores iniciales
                    const fields = card.fields.map(field => {
                        // Inicializar valor principal
                        initialFormValues[field.id] = field.type === 'checkbox' ? false : '';

                        // Inicializar subcampos de checkbox
                        if (field.type === 'checkbox' && field.toggleFields) {
                            field.toggleFields.forEach(subField => {
                                initialFormValues[subField.id] = '';
                            });
                        }

                        return field;
                    });

                    return { ...card, fields };
                });

            return { ...tab, cards };
        });

        setFormValues(initialFormValues);
        setTabs(initializedTabs);
    };

    const handleEditorChange = (html, fieldId) => {
        setFormValues(prev => ({ ...prev, [fieldId]: html }));
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'textarea':
                return (
                    <>
                        <label htmlFor={field.id} className='form-label'>{field.label}</label>
                        <Editor
                            value={formValues[field.id] || ''}
                            onTextChange={(e) => handleEditorChange(e.htmlValue, field.id)}
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
                            onChange={(e) => setFormValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                        >
                            <option value="" disabled>Seleccione</option>
                            {field.options.map((opt, i) => (
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
                                onChange={(e) => {
                                    setFormValues(prev => ({
                                        ...prev,
                                        [field.id]: e.target.checked
                                    }));
                                }}
                            />
                            <label className="form-check-label" htmlFor={field.id}>{field.label}</label>
                        </div>
                        {formValues[field.id] && field.toggleFields?.map(subField => (
                            <div key={subField.id}>
                                {subField.type === 'textarea' ? (
                                    <>
                                        <label htmlFor={subField.id} className='form-label'>{subField.label}</label>
                                        <Editor
                                            value={formValues[subField.id] || ''}
                                            onTextChange={(e) => handleEditorChange(e.htmlValue, subField.id)}
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
                                        onChange={(e) => setFormValues(prev => ({ ...prev, [subField.id]: e.target.value }))}
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
                            onChange={(e) => setFormValues(prev => ({ ...prev, [field.id]: e.target.value }))}
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
                            onChange={(e) => setFormValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                        />
                        <label htmlFor={field.id}>{field.label}</label>
                    </div>
                );
        }
    };

    const addNewTab = () => {
        const tabName = prompt('Ingrese el nombre de la nueva pestaña:');
        if (tabName) {
            setTabs(prev => [
                ...prev,
                {
                    tab: tabName,
                    cards: [{
                        title: 'Nueva Tarjeta',
                        fields: []
                    }]
                }
            ]);
            setActiveTab(tabs.length);
        }
    };

    const addNewCard = (tabIndex) => {
        const cardName = prompt('Ingrese el nombre de la tarjeta:', 'Nueva Tarjeta');
        if (cardName) {
            setTabs(prev => prev.map((tab, index) => {
                if (index === tabIndex) {
                    return {
                        ...tab,
                        cards: [...tab.cards, {
                            title: cardName,
                            fields: []
                        }]
                    };
                }
                return tab;
            }));
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

        setTabs(prev => prev.map(tab => {
            if (tab.cards.some(card => card === currentCard)) {
                return {
                    ...tab,
                    cards: tab.cards.map(card => {
                        if (card === currentCard) {
                            return {
                                ...card,
                                fields: [...card.fields, newField]
                            };
                        }
                        return card;
                    })
                };
            }
            return tab;
        }));
        setShowFieldModal(false);
        setNewFieldData({ type: 'text', label: '', options: '' });
    };

    const getFormConfiguration = () => {
        return {
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
        };
    };

    return (
        <div className="container-fluid p-3">
            <ul className="nav nav-tabs" id="customTabs">
                {tabs.map((tab, index) => (
                    <li key={index} className="nav-item">
                        <a
                            className={`nav-link cursor-pointer ${activeTab === index ? 'active' : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            {tab.tab}
                        </a>
                    </li>
                ))}
                <li className="nav-item">
                    <button className="btn btn-primary ms-2" onClick={addNewTab}>
                        Agregar Pestaña
                    </button>
                </li>
            </ul>

            <div className="tab-content mt-4">
                {tabs.map((tab, tabIndex) => (
                    <div
                        key={tabIndex}
                        className={`tab-pane fade ${activeTab === tabIndex ? 'show active' : ''}`}
                    >
                        <div className="row">
                            {tab.cards?.map((card, cardIndex) => (
                                <div key={cardIndex} className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{card.title}</h5>
                                            {card.fields?.map((field, fieldIndex) => (
                                                <div key={fieldIndex}>
                                                    {renderField(field)}
                                                </div>
                                            ))}
                                            <button
                                                className="btn btn-primary btn-sm mt-2"
                                                onClick={() => {
                                                    setCurrentCard(card);
                                                    setShowFieldModal(true);
                                                }}
                                            >
                                                Agregar Campo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-3">
                            <button
                                className="btn btn-primary"
                                onClick={() => addNewCard(tabIndex)}
                            >
                                Agregar Tarjeta
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const config = getFormConfiguration()
                                    console.log(config);

                                }}
                            >
                                Guardar formulario
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <CustomModal
                show={showFieldModal}
                onHide={() => setShowFieldModal(false)}
                title='Agregar Nuevo Campo'
            >
                <div className="modal-body">
                    <div className="mb-3">
                        <label className="form-label">Tipo de Campo</label>
                        <select
                            className="form-select"
                            value={newFieldData.type}
                            onChange={(e) => setNewFieldData(prev => ({
                                ...prev,
                                type: e.target.value
                            }))}
                        >
                            <option value="text">Texto</option>
                            <option value="textarea">Área de Texto</option>
                            <option value="select">Selección</option>
                            <option value="checkbox">Checkbox</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Etiqueta</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newFieldData.label}
                            onChange={(e) => setNewFieldData(prev => ({
                                ...prev,
                                label: e.target.value
                            }))}
                        />
                    </div>
                    {newFieldData.type === 'select' && (
                        <div className="mb-3">
                            <label className="form-label">
                                Opciones (separadas por comas)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={newFieldData.options}
                                onChange={(e) => setNewFieldData(prev => ({
                                    ...prev,
                                    options: e.target.value
                                }))}
                            />
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowFieldModal(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddField}
                    >
                        Guardar
                    </button>
                </div>
            </CustomModal>
        </div>
    );
};