import React, { useState, useEffect, useRef } from 'react';
import constants from '@/app/constants/constants';
import DateFormatter from '@/app/components/commons/formatDate';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { MyToolbar } from '@/app/components/documents/invoice/common/myToolbar';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import { Button } from 'primereact/button';

interface TableReceptionProps {
    lPartners: any[];
    withSearch: boolean;
    selectedRow: any;
    handleRowClick?: (row: DataTableRowClickEvent) => void;
    handleDoubleClick?: (row: DataTableRowClickEvent) => void;
    setSelectedRow?: React.Dispatch<React.SetStateAction<any>>;
    loading: boolean;
    downloadFiles: (data: any) => void;
}

export const TableReception = ({
    lPartners,
    withSearch,
    selectedRow,
    handleRowClick,
    handleDoubleClick,
    setSelectedRow,
    loading,
    downloadFiles
}: TableReceptionProps) => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filterCompany, setFilterCompany] = useState<{ id: string; name: string; fiscal_id: string; fiscal_regime_id: number } | null>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    const { t } = useTranslation('crp');
    const { t: tCommon } = useTranslation('common');
    const isMobile = useIsMobile();

    useEffect(() => {
        console.log(lPartners);
        
    }, [lPartners])

//*********** FILTROS DE TABLA ***********
        const initFilters = () => {
            setFilters({
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                dateFormated: { value: null, matchMode: FilterMatchMode.CONTAINS },
                company: { value: null, matchMode: FilterMatchMode.CONTAINS },
                provider_name: { value: null, matchMode: FilterMatchMode.IN },
                serie: { value: null, matchMode: FilterMatchMode.CONTAINS },
                folio: { value: null, matchMode: FilterMatchMode.CONTAINS },
                reference: { value: null, matchMode: FilterMatchMode.CONTAINS },
                amount: { value: null, matchMode: FilterMatchMode.EQUALS },
                status: {
                    operator: FilterOperator.OR,
                    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
                },
                date: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
                }
            });
            setGlobalFilterValue('');
        };
    
        const clearFilter = () => {
            initFilters();
        };
    
        const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            let _filters = { ...filters };
            (_filters['global'] as any).value = value;
    
            setFilters(_filters);
            setGlobalFilterValue(value);
        };
    
        const handleCompanyFilterChange = (e: any) => {
            const selectedCompany = e.value;
            setFilterCompany(selectedCompany);
    
            // Actualizar los filtros de la tabla
            let _filters = { ...filters };
    
            if (selectedCompany && selectedCompany.id !== null) {
                // Si se selecciona una compañía, aplicar filtro
                (_filters['company'] as any).value = selectedCompany.name;
            } else {
                // Si se limpia el filtro, establecer null
                (_filters['company'] as any).value = null;
            }
    
            setFilters(_filters);
        };
    
//*********** TEMPLATES DE TABLA ***********
    const dateBodyTemplate = (rowData: any) => {
        return DateFormatter(rowData.updated_at);
    };

    const fileBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button
                    label={tCommon('btnDownload')}
                    icon="bx bx-cloud-download bx-sm"
                    className="p-button-rounded p-button-text text-blue-500"
                    onClick={() => downloadFiles(rowData)}
                    tooltip={'Descargar archivos'}
                    tooltipOptions={{ position: 'top' }}
                    size="small"
                    disabled={loading}
                />
            </div>
        );
    };

//*********** INIT ***********
    useEffect(() => {
        const Init = async () => {
            initFilters();
        }
        Init();
    }, [])

    return (
        <>
            <MyToolbar 
                isMobile={isMobile}
                disabledUpload={false}
                globalFilterValue1={globalFilterValue}
                onGlobalFilterChange1={onGlobalFilterChange}
                clearFilter1={clearFilter}
                withBtnSendAuth={false}
                withBtnCleanFilter={false}
                withSearch={withSearch}
                withMounthFilter={false}
            />
            <br />
            <DataTable
                value={lPartners}
                paginator
                rowsPerPageOptions={constants.TABLE_ROWS}
                className="p-datatable-gridlines"
                rows={constants.TABLE_DEFAULT_ROWS}
                showGridlines
                filters={filters}
                filterDisplay="menu"
                responsiveLayout="scroll"
                emptyMessage={tCommon('datatable.emptyMessage')}
                scrollable
                scrollHeight="40rem"
                selectionMode="single"
                selection={selectedRow}
                onSelectionChange={(e) => setSelectedRow?.(e.value)}
                onRowClick={(e) => (handleRowClick?.(e))}
                onRowDoubleClick={(e) => (handleDoubleClick?.(e))}
                metaKeySelection={false}
                sortField="benef_trade_name"
                sortOrder={-1}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                resizableColumns
            >
                <Column field="id" header="id" hidden />
                <Column field="partner_address_partner_applying" header="partner_address_partner_applying" hidden />
                <Column field="fiscal_id" header="fiscal_id" hidden />
                <Column field="first_name" header="first_name" hidden />
                <Column field="last_name" header="last_name" hidden />
                <Column field="entity_type" header="entity_type" hidden />
                <Column field="fiscal_regime" header="fiscal_regime" hidden />
                <Column field="country" header="country" hidden />
                <Column field="dateFormatted" header="dateFormatted" hidden />
                <Column field="functional_area_obj" header="functional_area_obj" hidden />
                <Column field="company" header="company" hidden />
                <Column field="authz_acceptance_notes" header="authz_acceptance_notes" hidden />
                <Column field="trade_name" header="Proveedor" />
                <Column field="full_name" header="Nombre" />
                <Column field="email" header="Email" />
                <Column field="phone" header="Teléfono" />
                <Column field="functional_area" header="Area" />
                <Column field="updated_at" header="Fecha" body={dateBodyTemplate}/>
                <Column field="id" header='Archivos' footer='Archivos' body={fileBodyTemplate} />
            </DataTable>
        </>
    );
}