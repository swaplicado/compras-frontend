'use client';
import React, { useEffect, useState, useRef } from 'react';
import { CustomerService } from '@/demo/service/CustomerService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableFilterMeta, DataTableFilterMetaData } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressBar } from 'primereact/progressbar';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { classNames } from 'primereact/utils';
import type { Demo } from '@/types';
import { Toolbar } from 'primereact/toolbar';
import { Card } from 'primereact/card';
import UploadDialog from '@/app/components/documents/invoice/uploadDialog';
import axios from 'axios';
import loaderScreen from '@/app/components/loaderScreen';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import constants from '@/app/constants/constants';

const TableDemo = () => {
    const [customers1, setCustomers1] = useState<Demo.Customer[]>([]);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [lReferences, setLReferences] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    let userGroups = Cookies.get('groups') ? JSON.parse(Cookies.get('groups') || '[]') : [];
    const partnerId = Cookies.get('partnerId') ? JSON.parse(Cookies.get('partnerId') || '') : null;
    const [isInternalUser, setIsInternalUser] = useState(false);
    const [lProviders, setLProviders] = useState<any[]>([]);
    const [lCompanies, setLCompanies] = useState<any[]>([]);

    const representatives = [
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ];

    const statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'];

    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string) => {
        toast.current?.show({
            severity: type,
            summary: 'Error:',
            detail: message,
            life: 300000
        });
    };

    const getlReferences = async () => {
        try {
            const route = '/transactions/references/by-partner/';
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    partner_id: '2'
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lReferences: any[] = [];
                for (const item of data) {
                    lReferences.push({
                        id: item.id,
                        name: item.reference
                    });
                }

                setLReferences(lReferences);
                return true;
            } else {
                throw new Error(`${t('getReferencesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('getReferencesError'));
            return false;
        }
    };

    const getlProviders = async () => {
        try {
            const route = '/transactions/partners/';
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    is_deleted: false
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                console.log('data', data);
                let lProviders: any[] = [];
                for (const item of data) {
                    lProviders.push({
                        id: item.id,
                        name: item.trade_name
                    });
                }
                setLProviders(lProviders);
                return true;
            } else {
                throw new Error(`${t('getReferencesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('getReferencesError'));
            return false;
        }
    };

    const getlCompanies = async () => {
        try {
            const route = '/transactions/partners/list-companies/';
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lCompanies: any[] = [];
                for (const item of data) {
                    lCompanies.push({
                        id: item.id,
                        name: item.full_name
                    });
                }
                setLCompanies(lCompanies);
                return true;
            } else {
                throw new Error(`${t('getReferencesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('getReferencesError'));
            return false;
        }
    };

    const clearFilter1 = () => {
        initFilters1();
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    useEffect(() => {
        const fetchReferences = async () => {
            setLoading(true);

            CustomerService.getCustomersLarge().then((data) => {
                setCustomers1(getCustomers(data));
                setTableLoading(false);
            });
            initFilters1();

            let groups = [];
            if(!Array.isArray(userGroups)){
                groups = [userGroups];
            } else {
                groups = userGroups;
            }

            if (groups.includes(constants.ROLES.COMPRADOR_ID)) {
                setIsInternalUser(true);
                await getlProviders();
            }
            
            await getlReferences();
            await getlCompanies();
            setLoading(false);
        };
        fetchReferences();
    }, []);

    const getCustomers = (data: Demo.Customer[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    // funcion para aplicar el filtro de name automatiamcamente al escribir en el input
    const applyNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['name'] as DataTableFilterMetaData).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const countryBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <React.Fragment>
                <img alt="flag" src={`/demo/images/flag/flag_placeholder.png`} className={`flag flag-${rowData.country.code}`} width={30} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{rowData.country.name}</span>
            </React.Fragment>
        );
    };

    const filterClearTemplate = (options: ColumnFilterClearTemplateOptions) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    };

    const filterApplyTemplate = (options: ColumnFilterApplyTemplateOptions) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
    };

    const representativeBodyTemplate = (rowData: Demo.Customer) => {
        const representative = rowData.representative;
        return (
            <React.Fragment>
                <img
                    alt={representative.name}
                    src={`/demo/images/avatar/${representative.image}`}
                    onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
                    width={32}
                    style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{representative.name}</span>
            </React.Fragment>
        );
    };

    const representativeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <>
                <div className="mb-3 text-bold">Selector</div>
                <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Cualquiera" className="p-column-filter" />
            </>
        );
    };

    const representativesItemTemplate = (option: any) => {
        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={`/demo/images/avatar/${option.image}`} width={32} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{option.name}</span>
            </div>
        );
    };
    const nameFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputText value={options.value} onChange={(e) => applyNameFilter(e)} placeholder="Buscar por nombre" />;
    };

    const dateBodyTemplate = (rowData: Demo.Customer) => {
        return formatDate(rowData.date);
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const balanceBodyTemplate = (rowData: Demo.Customer) => {
        return formatCurrency(rowData.balance as number);
    };

    const balanceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    };

    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option: any) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    };

    const activityBodyTemplate = (rowData: Demo.Customer) => {
        return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '.5rem' }}></ProgressBar>;
    };

    const activityFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <React.Fragment>
                <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </React.Fragment>
        );
    };

    const verifiedBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': rowData.verified,
                    'text-pink-500 pi-times-circle': !rowData.verified
                })}
            ></i>
        );
    };

    const verifiedFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
    };

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" label={t('btnOpenDialogUpload')} className="mr-2" rounded onClick={() => setDialogVisible(true)} tooltip={t('tooltipBtnOpenDialogUpload')}/>
        </React.Fragment>
    );

    const centerContent = (
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder={tCommon('placeholderSearch')} />
        </span>
    );

    const endContent = <Button type="button" icon="pi pi-filter-slash" label={tCommon('btnCleanFilter')} onClick={clearFilter1} style={{ borderRadius: '3rem' }}  tooltip={tCommon('tooltipCleanFilter')} tooltipOptions={{ position: 'left' }} />;

    const headerCard = (
        <div
            className="
                flex align-items-center justify-content-center border-bottom-1
                surface-border surface-card sticky top-0 z-1 shadow-2 transition-all transition-duration-300
                "
            style={{
                padding: '1rem',
                minHeight: '4rem'
            }}
        >
            <h3 className="m-0 text-900 font-medium">{t('title')}</h3>
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                    <UploadDialog 
                        visible={dialogVisible} 
                        onHide={() => setDialogVisible(false)} 
                        lReferences={lReferences} 
                        lProviders={lProviders} 
                        lCompanies={lCompanies} 
                        isInternalUser={isInternalUser}
                        partnerId={partnerId}
                    />
                    <Toolbar start={startContent} center={centerContent} end={endContent} className="border-bottom-1 surface-border surface-card shadow-1 transition-all transition-duration-300" style={{ borderRadius: '3rem', padding: '0.8rem' }} />
                    <br />
                    <DataTable
                        value={customers1}
                        paginator
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="p-datatable-gridlines"
                        rows={5}
                        showGridlines
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={tableLoading}
                        responsiveLayout="scroll"
                        emptyMessage="No customers found."
                    >
                        <Column 
                            field="name" 
                            header="Name" 
                            filter 
                            filterPlaceholder="Buscar por nombre" 
                            style={{ minWidth: '12rem' }} 
                            showFilterMatchModes={false} 
                            filterElement={nameFilterTemplate} 
                            filterApply={<></>}
                            filterClear={<></>}
                        />
                        <Column 
                            header="Country" 
                            filterField="country.name" 
                            style={{ minWidth: '12rem' }} 
                            body={countryBodyTemplate} 
                            filter 
                            filterPlaceholder="Search by country" 
                            filterClear={filterClearTemplate} 
                            filterApply={filterApplyTemplate} 
                        />
                        <Column
                            header="Agent"
                            filterField="representative"
                            showFilterMatchModes={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '14rem' }}
                            body={representativeBodyTemplate}
                            filter
                            filterElement={representativeFilterTemplate}
                        />
                        <Column header="Date" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                        <Column header="Balance" filterField="balance" dataType="numeric" style={{ minWidth: '10rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />
                        <Column field="status" header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                        <Column field="activity" header="Activity" showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} />
                        <Column field="verified" header="Verified" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} />
                    </DataTable>
                </Card>
            </div>
        </div>
    );
};

export default TableDemo;
