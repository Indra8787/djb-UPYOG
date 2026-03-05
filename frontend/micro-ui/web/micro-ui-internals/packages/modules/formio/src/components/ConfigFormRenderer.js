import React, { useState, useEffect } from 'react';
import { Dropdown, Card, Header, Loader } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { formioAPIFetch } from '../utils/apiConfig';
import FormRenderer from './FormRenderer';

const ConfigFormRenderer = () => {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await formioAPIFetch('/forms');
        if (!response.ok) throw new Error('Failed to fetch forms');
        const data = await response.json();
        setForms(data);
      } catch (err) {
        console.error("Error fetching forms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (loading) return <Loader />;

  return (
    <React.Fragment>
      <Card>
        <Header>{t("FORMIO_SELECT_FORM_HEADER") || "Select Form to Render"}</Header>
        <div style={{ marginBottom: '20px' }}>
          <Dropdown
            option={forms}
            optionKey="formKey"
            selected={selectedForm}
            select={(value) => setSelectedForm(value)}
            t={t}
            placeholder={t("FORMIO_SELECT_FORM") || "Select a Form"}
          />
        </div>
      </Card>

      {selectedForm && (
        <div style={{ marginTop: '24px' }}>
          <FormRenderer key={selectedForm.id} formId={selectedForm.id} />
        </div>
      )}
    </React.Fragment>
  );
};

export default ConfigFormRenderer;