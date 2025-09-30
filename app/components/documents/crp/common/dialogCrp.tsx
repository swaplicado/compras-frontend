import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RenderField } from '@/app/components/commons/renderField';
import { useTranslation } from 'react-i18next';
import { getEntries } from '@/app/(main)/utilities/documents/payments/paymentsUtils';
import { formatCurrency } from '@/app/(main)/utilities/documents/common/currencyUtils';
import constants from '@/app/constants/constants';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomFileViewer } from '@/app/components/documents/invoice/fileViewer';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { FileUpload } from 'primereact/fileupload';
import { Messages } from 'primereact/messages';
import axios from 'axios';
import { ValidateXmlCrp } from './validXmlXrp';
import DateFormatter from '@/app/components/commons/formatDate';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';

interface DialogCrpProps {
    visible: boolean;
    onHide: () => void;
    isMobile: boolean;
    footerContent: any;
    headerTitle: string;
    oCrp: any;
    setOCrp: React.Dispatch<React.SetStateAction<any>>;
    dialogMode: 'create' | 'view' | 'edit';
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    loading?: boolean;
    oUser: any;
    withHeader?: boolean;
    withBody?: boolean;
    withFooter?: boolean;
    lCompanies?: any[];
    lProviders?: any[];
    lPaymentsExec?: any[];
    lAreas?: any[];
    loadinglPaymentsExec?: boolean;
    clean?: () => void;
    fileUploadRef: React.RefObject<FileUpload>;
    isXmlValid: boolean;
    setIsXmlValid: React.Dispatch<React.SetStateAction<boolean>>;
    showing: 'body' | 'animationSuccess' | 'animationError';
    successTitle?: string;
    successMessage?: string;
    errorTitle?: string;
    errorMessage?: string;
    formErrors: any;
    setFormErrors: React.Dispatch<React.SetStateAction<any>>;
    loadingFiles?: boolean;
    lFiles?: any[];
    lPaymentsExecDetails?: any[];
}

export const DialogCrp = ({
    visible,
    onHide,
    isMobile,
    footerContent,
    headerTitle,
    oCrp,
    setOCrp,
    dialogMode,
    showToast,
    setLoading,
    loading,
    oUser,
    withHeader,
    withBody,
    withFooter,
    lCompanies,
    lProviders,
    lAreas,
    lPaymentsExec,
    loadinglPaymentsExec,
    clean,
    fileUploadRef,
    isXmlValid,
    setIsXmlValid,
    showing,
    successTitle,
    successMessage,
    errorTitle,
    errorMessage,
    formErrors,
    setFormErrors,
    loadingFiles,
    lFiles = [],
    lPaymentsExecDetails = []
}: DialogCrpProps) => {
    const { t } = useTranslation('crp');
    const { t: tCommon } = useTranslation('common');
    const [totalSize, setTotalSize] = useState(0);
    const [fileErrors, setFilesErrros] = useState({
        files: false,
        includeXml: false
    });
    const message = useRef<Messages>(null);
    const [loadingValidateXml, setLoadingValidateXml] = useState(false);

    //****Funciones****/
    //Para formatear el input del componente Calendar
    const inputCalendarRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputCalendarRef.current && oCrp.xml_date) {
                inputCalendarRef.current.value = DateFormatter(oCrp.xml_date);
            }
        }, 100);
    }, [oCrp?.xml_date]);

    //****INIT****/
    useEffect(() => {
        const fetch = async () => {
            clean?.();
        };

        if (!visible) {
            fetch();
        }

        if (visible) {
            if (oUser.isProvider) {
                const oProvider = {
                    id: oUser.oProvider.id,
                    name: oUser.oProvider.name,
                    country: oUser.oProvider.country
                }
                setOCrp?.((prev: any) => ({ ...prev, oProvider: oProvider }));
            }
        }
    }, [visible]);

    return (
        <div className="flex justify-content-center">
            <Dialog header={headerTitle} visible={visible} onHide={onHide} footer={footerContent} pt={{ header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' } }} style={{ width: isMobile ? '100%' : '70rem' }}>
                {animationSuccess({
                    show: showing == 'animationSuccess',
                    title: successTitle || '',
                    text: successMessage || '',
                    buttonLabel: tCommon('btnClose'),
                    action: onHide
                }) ||
                    animationError({
                        show: showing == 'animationError',
                        title: errorTitle || '',
                        text: errorMessage || '',
                        buttonLabel: tCommon('btnClose'),
                        action: onHide
                    })}

                {showing == 'body' && (
                    <>
                        <br />
                        {withHeader && (
                            <div className="p-fluid formgrid grid">
                                {RenderField({
                                    label: 'Empresa',
                                    tooltip: 'Empresa',
                                    value: oCrp?.oCompany,
                                    disabled: dialogMode == 'view' || dialogMode == 'edit',
                                    mdCol: 6,
                                    type: dialogMode == 'create' ? 'dropdown' : 'text',
                                    onChange: (value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, oCompany: value }));
                                    },
                                    options: lCompanies,
                                    placeholder: 'Selecciona empresa',
                                    errorKey: '',
                                    errors: formErrors,
                                    errorMessage: ''
                                })}
                                { !oUser?.isProvider && (
                                    RenderField({
                                        label: 'Proveedor',
                                        tooltip: 'Proveedor',
                                        value: oCrp?.oProvider,
                                        disabled: dialogMode == 'view' || dialogMode == 'edit',
                                        mdCol: 6,
                                        type: dialogMode == 'create' ? 'dropdown' : 'text',
                                        onChange: (value) => {
                                            setOCrp?.((prev: any) => ({ ...prev, oProvider: value }));
                                        },
                                        options: lProviders,
                                        placeholder: 'Selecciona proveedor',
                                        errorKey: '',
                                        errors: formErrors,
                                        errorMessage: ''
                                    })
                                )}

                                {(!loadinglPaymentsExec || (dialogMode == 'view' || dialogMode == 'edit')) && (
                                    <>
                                        { (dialogMode == 'create' || dialogMode == 'edit') && (
                                            <RenderField
                                                label={'Pago'}
                                                tooltip={'pago'}
                                                value={oCrp?.oPay}
                                                disabled={lPaymentsExec?.length == 0}
                                                mdCol={6}
                                                type={(dialogMode == 'create' || dialogMode == 'edit') ? 'multiselect' : 'text'}
                                                onChange={(value) => {
                                                    setOCrp?.((prev: any) => ({ ...prev, oPay: value }));
                                                }}
                                                options={lPaymentsExec}
                                                placeholder={'Selecciona pago'}
                                                errorKey={''}
                                                errors={formErrors}
                                                errorMessage={''}
                                            />
                                        )}
                                        <RenderField
                                            label={'Area'}
                                            tooltip={'Area'}
                                            value={oCrp?.functional_area}
                                            disabled={dialogMode == 'view' || lAreas?.length == 0}
                                            mdCol={6}
                                            type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                            onChange={(value) => {
                                                setOCrp?.((prev: any) => ({ ...prev, functional_area: value }));
                                                setFormErrors?.((prev: any) => ({ ...prev, area: false }));
                                            }}
                                            options={lAreas}
                                            placeholder={'Selecciona area'}
                                            errorKey={'area'}
                                            errors={formErrors}
                                            errorMessage={'Selecciona area'}
                                        />
                                    </>
                                )}

                                { dialogMode == 'view' && !loadinglPaymentsExec && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <DataTable
                                                    value={lPaymentsExecDetails}
                                                    paginator
                                                    rowsPerPageOptions={constants.TABLE_ROWS}
                                                    className="p-datatable-gridlines"
                                                    rows={constants.TABLE_DEFAULT_ROWS}
                                                    showGridlines
                                                    responsiveLayout="scroll"
                                                    emptyMessage={tCommon('datatable.emptyMessage')}
                                                    scrollable
                                                    scrollHeight="40rem"
                                                    sortField="date"
                                                    sortOrder={-1}
                                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                                    currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                                                    resizableColumns
                                                >
                                                    <Column field="id" header="id" hidden />
                                                    <Column field="folio" header="Folio" />
                                                    <Column field="amount" header="Monto" />
                                                    <Column field="currency_code" header="Moneda" />
                                                    <Column field="exec_date_n" header="fecha" />
                                                </DataTable>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {loadinglPaymentsExec && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <div className="flex justify-content-center">
                                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {oCrp?.oPay && dialogMode == 'create' && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <ValidateXmlCrp
                                                    xmlUploadRef={fileUploadRef}
                                                    oCompany={oCrp?.oCompany}
                                                    oPartner={oCrp?.oProvider}
                                                    oUser={oUser.oUser}
                                                    oPay={oCrp?.oPay}
                                                    oCrp={oCrp}
                                                    errors={fileErrors}
                                                    setErrors={setFilesErrros}
                                                    setOCrp={setOCrp}
                                                    setIsXmlValid={setIsXmlValid}
                                                    setLoadingValidateXml={setLoadingValidateXml}
                                                    showToast={showToast}
                                                />

                                                {loadingValidateXml && (
                                                    <div className="flex justify-content-center">
                                                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {withBody && isXmlValid && (dialogMode == 'create' || dialogMode == 'edit' || dialogMode == 'view') && (
                            <div className="p-fluid formgrid grid">
                                {RenderField({
                                    label: 'RFC emisor:',
                                    tooltip: 'RFC emisor:',
                                    value: oCrp?.rfc_issuer,
                                    disabled: true,
                                    mdCol: 6,
                                    type: 'text',
                                    onChange: (value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, rfc_issuer: value }));
                                    },
                                    options: [],
                                    placeholder: '',
                                    errorKey: '',
                                    errors: formErrors,
                                    errorMessage: ''
                                })}
                                {RenderField({
                                    label: 'Régimen fiscal emisor:',
                                    tooltip: 'Régimen fiscal emisor:',
                                    value: oCrp?.tax_regime_issuer?.code + ' - ' + oCrp?.tax_regime_issuer?.name,
                                    disabled: true,
                                    mdCol: 6,
                                    type: 'text',
                                    onChange: (value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, tax_regime_issuer: value }));
                                    },
                                    options: [],
                                    placeholder: '',
                                    errorKey: '',
                                    errors: formErrors,
                                    errorMessage: ''
                                })}
                                {RenderField({
                                    label: 'RFC receptor:',
                                    tooltip: 'RFC receptor:',
                                    value: oCrp?.rfc_receiver,
                                    disabled: true,
                                    mdCol: 6,
                                    type: 'text',
                                    onChange: (value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, rfc_receiver: value }));
                                    },
                                    options: [],
                                    placeholder: '',
                                    errorKey: '',
                                    errors: formErrors,
                                    errorMessage: ''
                                })}
                                {RenderField({
                                    label: 'Régimen fiscal receptor:',
                                    tooltip: 'Régimen fiscal receptor:',
                                    value: oCrp?.tax_regime_receiver?.code + ' - ' + oCrp?.tax_regime_receiver?.name,
                                    disabled: true,
                                    mdCol: 6,
                                    type: 'text',
                                    onChange: (value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, tax_regime_receiver: value }));
                                    },
                                    options: [],
                                    placeholder: '',
                                    errorKey: '',
                                    errors: formErrors,
                                    errorMessage: ''
                                })}
                                {RenderField({
                                    label: 'UUID:',
                                    tooltip: 'UUID:',
                                    value: oCrp?.uuid,
                                    disabled: true,
                                    mdCol: 6,
                                    type: 'text',
                                    onChange: (value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, uuid: value }));
                                    },
                                    options: [],
                                    placeholder: '',
                                    errorKey: '',
                                    errors: formErrors,
                                    errorMessage: ''
                                })}
                                {RenderField({
                                    label: 'Fecha:',
                                    tooltip: 'Fecha:',
                                    value: oCrp?.xml_date,
                                    disabled: true,
                                    mdCol: 6,
                                    type: dialogMode == 'create' ? 'calendar' : 'text',
                                    inputRef: inputCalendarRef,
                                    onChange: (value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, xml_date: value }));
                                    },
                                    options: [],
                                    placeholder: '',
                                    errorKey: '',
                                    errors: formErrors,
                                    errorMessage: ''
                                })}
                            </div>
                        )}

                        { withFooter && (dialogMode == 'view' || dialogMode == 'edit') && (
                            <>
                                {!loadingFiles && (
                                    <CustomFileViewer lFiles={lFiles} />
                                )}

                                {loadingFiles && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <div className="flex justify-content-center">
                                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </Dialog>
        </div>
    );
};
