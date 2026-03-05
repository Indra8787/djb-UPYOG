import React, { useState, useEffect, useRef } from 'react';
import { Form } from '@formio/react';
import { Formio } from 'formiojs';
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getFormioAPIBaseURL, formioAPIFetch } from '../utils/apiConfig';
import {
    Header,
    Card,
    Loader,
    Toast
} from "@djb25/digit-ui-react-components";
import 'formiojs/dist/formio.full.min.css';

const FormRenderer = ({ formId: propFormId }) => {
    const { t } = useTranslation();
    const { id } = useParams();   // ✅ get id from route

    const [formSchema, setFormSchema] = useState(null);
    const [formName, setFormName] = useState("");
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(null);
    const isMounted = useRef(true);

    // ✅ Prefer prop, then query param 'id', then route param 'id'
    const query = new URLSearchParams(window.location.search);
    const formId = propFormId || query.get('id') || id;

    useEffect(() => {
        isMounted.current = true;

        if (!formId) {
            setShowToast({
                error: true,
                label: t("FORMIO_FORM_ID_MISSING") || "Form ID is missing"
            });
            setLoading(false);
            return;
        }

        const fetchForm = async () => {
            try {
                Formio.setProjectUrl(getFormioAPIBaseURL());

                const res = await formioAPIFetch(`/forms/${Number(formId)}`);
                if (!res.ok) {
                    throw new Error(
                        t("FORMIO_FORM_LOAD_ERROR") || "Failed to load form"
                    );
                }

                const data = await res.json();

                if (isMounted.current) {
                    setFormSchema(data.schema);
                    setFormName(data.formKey || "Form");
                }

            } catch (err) {
                if (isMounted.current) {
                    setShowToast({
                        error: true,
                        label: err.message
                    });
                }
            } finally {
                if (isMounted.current) setLoading(false);
            }
        };

        fetchForm();

        return () => {
            isMounted.current = false;
        };
    }, [formId, t]);

    const handleSubmit = async (submission) => {
        try {
            setLoading(true);

            const payload = {
                formId: Number(formId),   // ✅ convert to integer
                data: submission.data
            };

            const res = await formioAPIFetch('/submissions', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to submit form");
            }

            setShowToast({
                label: t("FORMIO_SUBMISSION_SUCCESS") || "Form submitted successfully!"
            });

        } catch (err) {
            setShowToast({
                error: true,
                label: err.message || "Error"
            });
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    if (loading && !formSchema) return <Loader />;

    return (
        <Card>
            <Header>
                {formName
                    ? `${t("FORMIO_FILL_FORM") || "Fill Form"}: ${formName}`
                    : t("FORMIO_FILL_FORM") || "Fill Form"}
            </Header>

            {formSchema ? (
                <div
                    className="formio-renderer-wrapper"
                    style={{ marginTop: '20px', padding: '15px', background: '#fff' }}
                >
                    <Form
                        form={formSchema}
                        onSubmit={handleSubmit}
                        options={{
                            noAlerts: true,
                            language: 'en'
                        }}
                    />
                </div>
            ) : (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    {t("FORMIO_FORM_NOT_FOUND") || "Form not found."}
                </div>
            )}

            <div
                style={{
                    marginTop: '24px',
                    gap: '12px',
                    display: 'flex',
                    justifyContent: 'left'
                }}
            >
                <button
                    onClick={() =>
                        window.location.href = "/digit-ui/employee/formio/formlist"
                    }
                    style={{
                        background: '#fff',
                        border: '1px solid #6c757d',
                        color: '#6c757d',
                        padding: '10px 20px',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {t("FORMIO_BACK_TO_LIST") || "Back to List"}
                </button>

                <button
                    onClick={() =>
                        window.location.href = "/digit-ui/employee"
                    }
                    style={{
                        background: '#fff',
                        border: '1px solid #6c757d',
                        color: '#6c757d',
                        padding: '10px 20px',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {t("FORMIO_BACK_TO_HOME") || "Back to Home"}
                </button>
            </div>

            {showToast && (
                <Toast
                    error={showToast.error}
                    label={showToast.label}
                    onClose={() => setShowToast(null)}
                    style={{ bottom: '20px', right: '20px' }}
                />
            )}
        </Card>
    );
};

export default FormRenderer;
