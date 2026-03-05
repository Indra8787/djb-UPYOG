import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FormBuilder } from '@formio/react';
import { Formio } from 'formiojs';
import { useTranslation } from "react-i18next";
import { getFormioAPIBaseURL, formioAPIFetch } from '../utils/apiConfig';
import {
  Header,
  Card,
  TextInput,
  LabelFieldPair,
  CardLabel,
  SubmitBar,
  Loader,
  Toast
} from "@djb25/digit-ui-react-components";
import 'formiojs/dist/formio.full.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

const getInitialFormSchema = () => ({
  display: 'form',
  type: 'form',
  components: []
});

const ALLOWED_KEYS = [
  "type",
  "key",
  "label",
  "input",
  "validate",
  "values",
  "multiple",
  "defaultValue",
  "placeholder",
  "protected",
  "action",
  "theme",
  "size",
  // Label customization options
  "labelPosition",
  "labelWidth",
  "labelMargin",
  // Layout component options
  "title",
  "legend",
  "numRows",
  "numCols",
  "header",
  "tableView",
  "striped",
  "bordered",
  "hover",
  "condensed",
  "hideLabel",
  "collapsible",
  "collapsed",
];

const cleanComponent = (component) => {
  const cleaned = {};

  ALLOWED_KEYS.forEach((key) => {
    if (component[key] !== undefined) {
      cleaned[key] = component[key];
    }
  });

  // Handle nested components (for panels, fieldsets, etc.)
  if (Array.isArray(component.components)) {
    cleaned.components = component.components.map(cleanComponent);
  }

  // Handle columns layout (for columns component)
  if (Array.isArray(component.columns)) {
    cleaned.columns = component.columns.map((column) => {
      const cleanedColumn = {};
      // Preserve column properties like width, offset, etc.
      if (column.width !== undefined) cleanedColumn.width = column.width;
      if (column.offset !== undefined) cleanedColumn.offset = column.offset;
      if (column.push !== undefined) cleanedColumn.push = column.push;
      if (column.pull !== undefined) cleanedColumn.pull = column.pull;
      if (column.size !== undefined) cleanedColumn.size = column.size;
      // Recursively clean nested components in each column
      if (Array.isArray(column.components)) {
        cleanedColumn.components = column.components.map(cleanComponent);
      }
      return cleanedColumn;
    });
  }

  // Handle rows for table component
  if (Array.isArray(component.rows)) {
    cleaned.rows = component.rows.map((row) => {
      return row.map((cell) => {
        const cleanedCell = {};
        if (Array.isArray(cell.components)) {
          cleanedCell.components = cell.components.map(cleanComponent);
        }
        return cleanedCell;
      });
    });
  }

  return cleaned;
};

const cleanFormSchema = (schema) => {
  if (!schema || !schema.components) return getInitialFormSchema();
  return {
    display: schema.display || 'form',
    type: schema.type || 'form',
    components: schema.components
      .map(cleanComponent)
  };
};

const FormBuilderComponent = () => {
  const { t } = useTranslation();
  const [rawForm, setRawForm] = useState(() => {
    try {
      const saved = localStorage.getItem('formio_form_builder_state');
      return saved ? JSON.parse(saved) : getInitialFormSchema();
    } catch (e) {
      return getInitialFormSchema();
    }
  });

  const [cleanForm, setCleanForm] = useState(() => cleanFormSchema(rawForm));
  const [formName, setFormName] = useState('untitled');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [availableForms, setAvailableForms] = useState([]);
  const [selectedFormIds, setSelectedFormIds] = useState(new Set());
  const [showFormSelector, setShowFormSelector] = useState(false);
  const [selectedFormForImport, setSelectedFormForImport] = useState(null);
  const [currentEditingComponent, setCurrentEditingComponent] = useState(null);
  const isMounted = useRef(true);
  const formBuilderRef = useRef(null);

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const formId = params.get('id');
  const isViewOnly = params.get('view') === 'true';

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    isMounted.current = true;

    // Configure Formio Project URL for nested forms
    Formio.setProjectUrl(getFormioAPIBaseURL());

    // Fetch list of saved forms for nested insertion
    const fetchFormsList = async () => {
      try {
        const res = await formioAPIFetch('/forms');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted.current && Array.isArray(data)) {
          setAvailableForms(data);
        }
      } catch (e) {
        // ignore silently; not critical
      }
    };
    fetchFormsList();

    if (formId) {
      const fetchForm = async () => {
        try {
          setLoading(true);
          const res = await formioAPIFetch(`/forms/${formId}`);
          if (!res.ok) throw new Error(t("FORMIO_FORM_LOAD_ERROR") || "Failed to load form");
          const data = await res.json();
          if (isMounted.current) {
            setRawForm(data.schema);
            setCleanForm(cleanFormSchema(data.schema));
            setFormName(data.formKey || 'untitled');
          }
        } catch (err) {
          if (isMounted.current) setShowToast({ error: true, label: err.message });
        } finally {
          if (isMounted.current) setLoading(false);
        }
      };
      fetchForm();
    }

    return () => {
      isMounted.current = false;
    };
  }, [formId, t]);

  // Handle form component edit and show import modal
  useEffect(() => {
    // Set up Formio event listeners for component editing
    const setupFormioListeners = () => {
      if (window.Formio && window.Formio.events) {
        window.Formio.events.on('componentEdit', (component) => {
          if (component && component.type === 'form') {
            setCurrentEditingComponent(component);
            setShowFormSelector(true);
          }
        });
      }
    };

    // Also listen to the global window for formio edit events
    const handleGlobalEdit = (e) => {
      if (e.detail && e.detail.component && e.detail.component.type === 'form') {
        setCurrentEditingComponent(e.detail.component);
        setShowFormSelector(true);
      }
    };

    setupFormioListeners();
    window.addEventListener('formioComponentEdit', handleGlobalEdit);

    return () => {
      window.removeEventListener('formioComponentEdit', handleGlobalEdit);
    };
  }, [t]);

  const handleFormChange = useCallback((schema) => {
    if (!isMounted.current) return;
    if (isViewOnly) return;

    if (schema === null || typeof schema !== 'object' || Array.isArray(schema)) {
      return;
    }

    setRawForm(schema);
    const cleaned = cleanFormSchema(schema);
    setCleanForm(cleaned);

    if (!formId) {
      localStorage.setItem('formio_form_builder_state', JSON.stringify(schema));
    }
  }, [formId, isViewOnly]);

  const handleSaveForm = async () => {
    try {
      setLoading(true);

      const payload = {
        formKey: formName,
        schema: cleanForm
      };

      const endpoint = formId ? `/forms/${formId}` : `/forms`;
      const method = formId ? "PUT" : "POST";

      const res = await formioAPIFetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");

      setShowToast({ label: formId ? t("HR_FORM_UPDATE_SUCCESS") || "Form updated successfully" : t("HR_FORM_SAVE_SUCCESS") || "Form saved successfully" });
    } catch (err) {
      setShowToast({ error: true, label: err.message || "Error" });
    } finally {
      if (isMounted.current) setLoading(false);
    }
    const freshSchema = getInitialFormSchema();
    setRawForm(freshSchema);
    setCleanForm(freshSchema);
    setFormName('untitled');
    localStorage.removeItem('formio_form_builder_state');
  };

  const formList = () => {
    window.location.href = "/digit-ui/employee/formio/formlist";
  };

  const toggleSelectForm = (id) => {
    setSelectedFormIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const insertSelectedForms = async () => {
    if (selectedFormIds.size === 0) return;
    setLoading(true);
    try {
      const ids = Array.from(selectedFormIds);
      for (const id of ids) {
        const res = await formioAPIFetch(`/forms/${id}`);
        if (!res.ok) continue;
        const data = await res.json();
        const importedSchema = data && data.schema && data.schema.components ? data.schema.components : [];

        // Wrap imported components in a panel so they are visually grouped
        const panel = {
          type: 'panel',
          key: `imported_panel_${id}_${Date.now()}`,
          title: data.formKey || 'Imported Form',
          components: importedSchema
        };

        const nextRaw = Object.assign({}, rawForm, { components: [...(rawForm.components || []), panel] });
        setRawForm(nextRaw);
        const cleaned = cleanFormSchema(nextRaw);
        setCleanForm(cleaned);
      }

      if (!formId) {
        localStorage.setItem('formio_form_builder_state', JSON.stringify(rawForm));
      }

      setShowToast({ label: t("HR_FORM_IMPORT_SUCCESS") || "Imported selected forms into builder" });
      setSelectedFormIds(new Set());
    } catch (err) {
      setShowToast({ error: true, label: err.message || 'Error importing forms' });
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleImportFormToComponent = async () => {
    if (!selectedFormForImport || !currentEditingComponent) return;
    try {
      const res = await formioAPIFetch(`/forms/${selectedFormForImport}`);
      if (!res.ok) throw new Error('Failed to fetch form');
      const data = await res.json();
      const importedComponents = data && data.schema && data.schema.components ? data.schema.components : [];

      // Update the currently editing component with imported schema
      if (currentEditingComponent) {
        currentEditingComponent.components = importedComponents;
        if (currentEditingComponent.schema) {
          currentEditingComponent.schema.components = importedComponents;
        }
      }

      setShowToast({ label: t("FORM_IMPORTED_SUCCESS") || 'Form imported into nested component' });
      setShowFormSelector(false);
      setSelectedFormForImport(null);
      setCurrentEditingComponent(null);
    } catch (err) {
      setShowToast({ error: true, label: err.message || 'Error importing form' });
    }
  };

  const options = React.useMemo(() => ({
    builder: {
      basic: {
        title: t("BASIC_COMPONENTS") || "Basic Components",
        weight: 0,
        components: {
          textfield: true,
          textarea: true,
          number: true,
          password: true,
          email: true,
          select: false,
          radio: false,
          checkbox: true
        }
      },
      layout: {
        title: t("LAYOUT_COMPONENTS") || "Layout",
        weight: 10,
        components: {
          panel: true,
          columns: true,
          fieldset: true,
          table: true,
          form: true
        }
      },
      advanced: false,
      data: false,
      premium: false,
      custom: false,
      resource: false
    },
    language: 'en',
    readOnly: isViewOnly,
    noAlerts: true,
    noHelp: true
  }), [isViewOnly, t]);

  if (loading && formId) return <Loader />;

  return (
    <Card>
      <style>{`
      .formio-builder-wrapper .row{ display:flex; flex-wrap:wrap; margin-right:-15px; margin-left:-15px; }
      .formio-builder-wrapper .col{ flex-basis:0; flex-grow:1; max-width:100%; position:relative; width:100%; padding-right:15px; padding-left:15px; }
      .formio-builder-wrapper .formcomponents { flex: 0 0 250px !important; max-width: 250px !important; width: 250px !important; }
      .formio-builder-wrapper .formarea { flex: 1 !important; max-width: calc(100% - 250px) !important; }
      .formio-builder-wrapper .formcomponents .component-btn-group{ display:flex; flex-direction:column; gap:8px; width:100%; }
      .formio-builder-wrapper .formcomponents .btn { 
        white-space: nowrap !important; 
        overflow: hidden; 
        text-overflow: ellipsis; 
        padding: 8px 10px; 
        font-size: 14px; 
        text-align: left; 
        background-color: #fff; 
        color: #333;
        border: 1px solid #d6d6d6; 
        border-radius: 4px; 
        margin-bottom: 5px;
        width: 100%;
        display: flex;
        align-items: center;
      }
      .formio-builder-wrapper .formcomponents .btn:hover { 
        background-color: #f0f0f0; 
        border-color: #adadad;
      }
      .formio-builder-wrapper .formcomponents .btn i {
        margin-right: 8px;
      }
      .formio-builder-wrapper .formcomponents .component-btn-group.active, .formio-builder-wrapper .formcomponents .component-btn-group.open{ flex-direction:row; flex-wrap:wrap; gap:5px; }
      .formio-builder-wrapper .nav-link, .formio-dialog .nav-link { font-size: 14px !important; padding: 4px 10px !important; white-space: nowrap !important; }
      .formio-dialog .component-settings .sidebar { max-width: 220px !important; flex: 0 0 220px !important; }
      .formio-builder-wrapper a[href*="help"], .formio-dialog a[href*="help"] { display: none !important; }
      .formio-builder-wrapper .btn-primary { background:#872736; border-color:#872736; color: #fff; }
      .formio-builder-wrapper .form-control { font-size: 14px; }
      `}</style>

      <Header>{t("HR_FORM_BUILDER_HEADER") || "Form Builder"}</Header>

      <LabelFieldPair>
        <CardLabel>{t("HR_FORM_NAME_LABEL") || "Form Name"}</CardLabel>
        <div className="field">
          <TextInput
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            disable={isViewOnly}
            placeholder={t("HR_ENTER_FORM_NAME_PLACEHOLDER") || "Enter form name..."}
          />
        </div>
      </LabelFieldPair>

      <div className="formio-builder-wrapper" style={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '4px', background: '#fff' }}>
        {typeof FormBuilder === 'function' || typeof FormBuilder === 'object' ? (
          <FormBuilder
            ref={formBuilderRef}
            form={rawForm}
            onChange={handleFormChange}
            options={options}
            onComponentEdit={(component) => {
              if (component && component.type === 'form') {
                setCurrentEditingComponent(component);
                setShowFormSelector(true);
              }
            }}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            {t("HR_FORM_BUILDER_UNAVAILABLE") || "Form builder is not available. Ensure '@formio/react' is installed and exports FormBuilder."}
          </div>
        )}
      </div>

      {/* Saved forms list for nested insertion */}
      {!isViewOnly && availableForms && availableForms.length > 0 && (
        <div style={{ marginTop: '18px', padding: '12px', border: '1px solid #e6e6e6', borderRadius: '4px', background: '#fafafa' }}>
          <div style={{ marginBottom: '8px', fontWeight: '600' }}>{t('SAVED_FORMS_LABEL') || 'Saved Forms'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflow: 'auto' }}>
            {availableForms.map((f) => (
              <label key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={selectedFormIds.has(f.id)}
                  onChange={() => toggleSelectForm(f.id)}
                />
                <span>{f.formKey || f.name || f.id}</span>
              </label>
            ))}
          </div>
          <div style={{ marginTop: '10px' }}>
            {/* <button onClick={insertSelectedForms} style={{ background: '#872736', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '3px', cursor: 'pointer' }}>{t('IMPORT_SELECTED_BUTTON') || 'Insert Selected'}</button> */}
            <SubmitBar label={t('IMPORT_SELECTED_BUTTON') || 'Insert Selected'} onSubmit={insertSelectedForms} disabled={selectedFormIds.size === 0 || loading} />
          </div>
        </div>
      )}

      {/* Form Selector Modal for Nested Form Component */}
      {showFormSelector && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            minWidth: '400px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>{t('SELECT_FORM_TO_IMPORT') || 'Select Form to Import into Nested Component'}</h3>
            <select
              value={selectedFormForImport || ''}
              onChange={(e) => setSelectedFormForImport(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">{t('CHOOSE_FORM') || 'Choose a form...'}</option>
              {availableForms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.formKey || f.name || f.id}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowFormSelector(false);
                  setSelectedFormForImport(null);
                  setCurrentEditingComponent(null);
                }}
                style={{
                  background: '#fff',
                  border: '1px solid #ddd',
                  padding: '8px 16px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                {t('CANCEL') || 'Cancel'}
              </button>
              <button
                onClick={handleImportFormToComponent}
                disabled={!selectedFormForImport}
                style={{
                  background: selectedFormForImport ? '#872736' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '3px',
                  cursor: selectedFormForImport ? 'pointer' : 'not-allowed'
                }}
              >
                {t('IMPORT_BUTTON') || 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '24px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        {!isViewOnly && (
          <React.Fragment>
            <SubmitBar label={t("SAVE_FORM_BUTTON") || "Save Form"} onSubmit={handleSaveForm} disabled={loading} />
            {/* <button
              onClick={() => {
                if (window.confirm(t("RESET_CONFIRMATION") || "Are you sure you want to reset the builder?")) {
                  const freshSchema = getInitialFormSchema();
                  setRawForm(freshSchema);
                  setCleanForm(freshSchema);
                  setFormName('untitled');
                  localStorage.removeItem('hrms_form_builder_state');
                }
              }}
              style={{ background: '#fff', border: '1px solid #872736', color: '#872736', padding: '10px 20px', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {t("RESET_BUILDER_BUTTON") || "Reset Builder"}
            </button> */}
          </React.Fragment>
        )}
        <button
          onClick={formList}
          style={{ background: '#fff', border: '1px solid #6c757d', color: '#6c757d', padding: '10px 20px', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isViewOnly ? t("BACK_TO_LIST_BUTTON") || "Back to List" : t("SEE_ALL_FORMS_BUTTON") || "See All Forms"}
        </button>
      </div>

      {/* <div style={{ marginTop: '30px', background: '#111', color: '#fff', padding: '15px', borderRadius: '4px' }}>
        <h3 style={{ color: '#61dafb', marginBottom: '10px', fontSize: '16px' }}>JSON Preview</h3>
        <pre style={{ overflow: 'auto', maxHeight: '300px', fontSize: '12px', color: '#0f0' }}>
          {JSON.stringify(cleanForm, null, 2)}
        </pre>
      </div> */}

      {showToast && (
        <Toast
          error={showToast.error}
          label={showToast.label}
          onClose={closeToast}
          style={{ bottom: '20px', right: '20px' }}
        />
      )}
    </Card>
  );
};

export default FormBuilderComponent;