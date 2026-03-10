import { Header, ActionBar, SubmitBar, ExternalLinkIcon, Menu, GenericFileIcon, LinkButton, Loader, Card, StatusTable, Row, CardSubHeader } from '@djb25/digit-ui-react-components';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { openDocumentLink, openUploadedDocument, getFileUrl } from '../../utils';
import Confirmation from '../Modal/Confirmation';


const Actions = ['EDIT_DOCUMENT', 'DELETE']
const getUlbName = (tenantId) => {
    if (!tenantId) return 'NA';
    let ulbName = tenantId?.split('.')[1];
    ulbName = `${ulbName?.[0]?.toUpperCase() || ''}${ulbName?.slice(1) || ''} `;
    return ulbName;
}
const DocumentDetails = ({ location, match, history, }) => {
    let isMobile = window.Digit.Utils.browser.isMobile();
    const { t } = useTranslation();
    const { id } = match.params;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const detailsState = location?.state?.details;

    const [documentUrl, setDocumentUrl] = useState(null);
    const [displayMenu, setDisplayMenu] = React.useState(false);
    const [showModal, setShowModal] = useState(false);

    const { data: ulbArray, isLoading: loading } = Digit.Hooks.useTenants();
    const currrentUlb = Digit.ULBService.getCurrentUlb();
    const stateId = Digit.ULBService.getStateId();
    const { data: categoryOptions, isLoading: isCategoryLoading } = Digit.Hooks.engagement.useMDMS(stateId, "DocumentUploader", ["UlbLevelCategories"], {
        select: (d) => {
            const data = d?.DocumentUploader?.UlbLevelCategories?.filter?.((e) => e.ulb === currrentUlb.code);
            return data[0].categoryList.map((name) => ({ name }));
        },
    });

    const { data: searchResult, isLoading: isSearchDocLoading } = Digit.Hooks.engagement.useDocSearch(
        { name: id, tenantIds: tenantId },
        { enabled: !detailsState }
    );

    const details = detailsState || searchResult?.Documents?.[0];

    React.useEffect(() => {
        if (details?.filestoreId) {
            getFileUrl(details?.filestoreId).then((url) => {
                setDocumentUrl(url);
            });
        }
    }, [details?.filestoreId]);

    if ((!detailsState && isSearchDocLoading) || isCategoryLoading || loading) {
        return <Loader />;
    }

    if (!details) {
        return (
            <div>
                <Header>{t(`CE_DOCUMENT_DETAILS`)}</Header>
                <div className="notice_and_circular_main gap-ten">
                    <div className="documentDetails_wrapper">
                        <p style={{ textAlign: "center" }}>{t("ES_COMMON_NO_DATA") || "No Data Found"}</p>
                    </div>
                </div>
            </div>
        );
    }


    function onActionSelect(action) {
        setDisplayMenu(false);

        if (action?.includes('EDIT')) {
            const DocumentEntity = {
                tenantIds: details?.tenantId,
                documentName: details?.name,
                docCategory: categoryOptions?.filter((item) => item.name === details?.category)?.[0],
                document: {
                    filestoreId: { fileStoreId: details?.filestoreId },
                    documentLink: details?.documentLink
                },
                ULB: { code: details?.tenantId },
                ...details
            }
            history.push({
                pathname: `/digit-ui/employee/engagement/documents/inbox/update`,
                state: { DocumentEntity }
            })
        }

        if (action?.includes('DELETE')) {
            setShowModal(true)
        }
    }

    function onModalSubmit() {
        setShowModal(false)
        const DocumentEntity = {
            ...details
        }
        history.push({
            pathname: `/digit-ui/employee/engagement/documents/delete-response`,
            state: { DocumentEntity }
        })
    }

    function onModalCancel() {
        setShowModal(false)
    }

    return (
        <React.Fragment>
            <div>
                {showModal ? <Confirmation
                    t={t}
                    heading={'CONFIRM_DELETE_DOC'}
                    docName={details?.name}
                    closeModal={() => setShowModal(!showModal)}
                    actionCancelLabel={'CS_COMMON_CANCEL'}
                    actionCancelOnSubmit={onModalCancel}
                    actionSaveLabel={'ES_COMMON_Y_DEL'}
                    actionSaveOnSubmit={onModalSubmit}
                />

                    : null}
                <div style={{ padding: "16px", backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
                    <Header>{t(`CE_DOCUMENT_DETAILS`)}</Header>
                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "20px", marginTop: "20px", alignItems: "flex-start" }}>
                        {/* Left Column: Document Details */}
                        <div style={{ flex: "0 0 30%", minWidth: "280px" }}>
                            <Card style={{ margin: 0, height: "100%" }}>
                                <CardSubHeader style={{ marginBottom: "16px", fontSize: "24px" }}>{`${t('DOCUMENT_DETAILS')}`}</CardSubHeader>
                                <StatusTable>
                                    <Row className="border-none" label={`${t('ULB')}`} text={getUlbName(details?.tenantId)} textStyle={{ wordBreak: "break-word", width: "50%" }} />
                                    <Row className="border-none" label={`${t('DOCUMENT_NAME')}`} text={details?.name} textStyle={{ wordBreak: "break-word", width: "50%" }} />
                                    <Row className="border-none" label={`${t('DOCUMENT_CATEGORY')}`} text={t(details?.category)} textStyle={{ wordBreak: "break-word", width: "50%" }} />
                                    <Row className="border-none" label={`${t('DCOUMENT_DESCRIPTION')}`} text={details?.description?.length ? details?.description : 'NA'} textStyle={{ wordBreak: "break-word", width: "50%" }} />
                                </StatusTable>
                            </Card>
                        </div>

                        {/* Right Column: Iframe */}
                        <div style={{ flex: "1" }}>
                            <Card style={{ margin: 0, height: "100%", padding: "16px" }}>
                                {details?.filestoreId ? <div className="documentDetails_pdf" style={{ width: '100%' }}>
                                    <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px" }}>{`${t('Document')}`}</h2>
                                    {documentUrl ? (
                                        <iframe
                                            src={documentUrl}
                                            title={details?.name}
                                            style={{ width: '100%', height: '80vh', border: '1px solid #ccc', borderRadius: '4px' }}
                                        />
                                    ) : (
                                        <div style={{ marginTop: '10px' }}>
                                            <Loader />
                                        </div>
                                    )}
                                </div>
                                    : null
                                }
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <ActionBar>
                {displayMenu ? (
                    <Menu
                        style={{ width: isMobile ? 'full' : '240px' }}
                        localeKeyPrefix={"ES_CE"}
                        options={Actions}
                        t={t}
                        onSelect={onActionSelect}
                    />
                ) : null}
                <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
            </ActionBar>
        </React.Fragment>
    )
}

export default DocumentDetails;
