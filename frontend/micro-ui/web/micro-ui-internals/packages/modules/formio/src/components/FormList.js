import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { formioAPIFetch } from '../utils/apiConfig';
import {
  Header,
  Card,
  Table,
  Loader,
  SubmitBar,
  Toast
} from "@djb25/digit-ui-react-components";

const FormList = () => {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await formioAPIFetch('/forms');
        if (!response.ok) throw new Error('Failed to fetch forms');
        const data = await response.json();
        setForms(data);
      } catch (err) {
        setShowToast({ error: true, label: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleEdit = useCallback((id) => {
    history.push(`/digit-ui/employee/formio/formio?id=${id}`);
  }, [history]);

  const handleView = useCallback((id) => {
    history.push(`/digit-ui/employee/formio/formio?id=${id}&view=true`);
  }, [history]);

  const handleFill = useCallback((id) => {
    history.push(`/digit-ui/employee/formio/form-fill?id=${id}`);
  }, [history]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm(t("FORMIO_DELETE_CONFIRMATION") || "Are you sure you want to delete this form?")) {
      try {
        setLoading(true);
        const response = await formioAPIFetch(`/forms/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete form');
        setForms((prev) => prev.filter((form) => form.id !== id));
        setShowToast({ label: t("FORMIO_FORM_DELETE_SUCCESS") || "Form deleted successfully" });
      } catch (err) {
        setShowToast({ error: true, label: err.message });
      } finally {
        setLoading(false);
      }
    }
  }, [t]);

  const columns = React.useMemo(() => [
    {
      Header: t("FORMIO_FORM_NAME") || "Form Name",
      accessor: "formKey",
      Cell: ({ row }) => {
        return <span>{row.original.formKey}</span>;
      }
    },
    {
      Header: t("FORMIO_CREATED_AT") || "Created At",
      accessor: "createdAt",
      Cell: ({ row }) => {
        return <span>{new Date(row.original.createdAt).toLocaleString()}</span>;
      }
    },
    {
      Header: t("FORMIO_ACTIONS") || "Actions",
      Cell: ({ row }) => {
        return (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => handleFill(row.original.id)}
              style={{ background: '#28a745', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
            >
              {t("FORMIO_FILL") || "Fill"}
            </button>
            <button
              onClick={() => handleView(row.original.id)}
              style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
            >
              {t("FORMIO_VIEW") || "View"}
            </button>
            <button
              onClick={() => handleEdit(row.original.id)}
              style={{ background: '#872736', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
            >
              {t("FORMIO_EDIT") || "Edit"}
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
            >
              {t("FORMIO_DELETE") || "Delete"}
            </button>

          </div>
        );
      }
    }
  ], [t, handleDelete, handleEdit, handleFill, handleView]);

  if (loading) return <Loader />;

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Header>{t("FORMIO_SAVED_FORMS") || "Saved Forms"}</Header>
        <SubmitBar
          label={t("FORMIO_CREATE_NEW_FORM") || "Create New Form"}
          onSubmit={() => history.push('/digit-ui/employee/formio/formio')}
        />
      </div>

      {forms.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '4px' }}>
          {t("FORMIO_NO_FORMS_FOUND") || "No forms saved yet."}
        </div>
      ) : (
        <div className="form-list-table-wrapper">
          <Table
            t={t}
            data={forms}
            columns={columns}
            disableSort={false}
            autoSort={true}
            getCellProps={(cellInfo) => ({
              style: {
                minWidth: "150px",
                padding: "20px 18px",
                fontSize: "16px",
              },
            })}
          />
        </div>
      )}

      {showToast && (
        <Toast
          error={showToast.error}
          label={showToast.label}
          onClose={() => setShowToast(null)}
        />
      )}
    </Card>
  );
};

export default FormList;

