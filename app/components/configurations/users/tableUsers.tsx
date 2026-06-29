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
import { type } from 'node:os';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Checkbox } from "primereact/checkbox";

interface TableUsersProps {
    lUsers: any[];
    onTogglePermission?: (user_id: number, value: boolean) => void;
    options: Array<any>;
    option: string;
    onChangeProccessingType?: (partner_id: number, value: boolean, type_id: number) => void;
}

export const TableUsers = ({
    lUsers,
    onTogglePermission,
    options,
    option,
    onChangeProccessingType
}: TableUsersProps) => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filterCompany, setFilterCompany] = useState<{ id: string; name: string; fiscal_id: string; fiscal_regime_id: number } | null>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    const { t } = useTranslation('configUsers');
    const { t: tCommon } = useTranslation('common');
    const isMobile = useIsMobile();

//*********** FILTROS DE TABLA ***********
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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


//*********** TEMPLATES DE TABLA ***********
    const withOutReferenceBodyTemplate = (rowData: any) => {
        return (
            <Checkbox
                inputId={rowData.username}
                name="withOutReference"
                checked={rowData.has_invoice_without_oc_permission}
                onChange={(e) => onTogglePermission?.(rowData.id, !!e.checked)}
            />
        );
    }

    const processingType_flete = (rowData: any) => {
        const flete = rowData.processing_types?.find((item: any) => item.id == 11);

        return (
            <Checkbox
                inputId={rowData.username + '_flete'}
                name="processingType"
                checked={!!flete}
                onChange={(e) => onChangeProccessingType?.(rowData.id, !!e.checked, 11)}
            />
        )
    }

    const processingType_compras = (rowData: any) => {
        const compras = rowData.processing_types?.find((item: any) => item.id == 12);

        return (
            <Checkbox
                inputId={rowData.username + '_compras'}
                name="processingType"
                checked={!!compras}
                onChange={(e) => onChangeProccessingType?.(rowData.id, !!e.checked, 12)}
            />
        )
    }

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
                withSearch={true}
                withMounthFilter={false}
            />
            <br />
            { option == options[0] && (
                <DataTable
                    value={lUsers}
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
                    metaKeySelection={false}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                    resizableColumns
                >
                    <Column field="id" header="id" hidden />
                    <Column field="username" header={t('tableUser.columns.username')} />
                    <Column field="full_name" header={t('tableUser.columns.full_name')} />
                    <Column field="email" header={t('tableUser.columns.email')} />
                    <Column field="has_invoice_without_oc_permission" header={t('tableUser.columns.has_invoice_without_oc_permission')} body={withOutReferenceBodyTemplate} />
                </DataTable>
            )}

            {option == options[1] && (
                <DataTable
                    value={lUsers}
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
                    metaKeySelection={false}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                    resizableColumns
                >
                    <Column field="id" header="id" hidden />
                    <Column field="fiscal_id" header={t('tablePartners.columns.fiscal_id')} />
                    <Column field="trade_name" header={t('tablePartners.columns.trade_name')} />
                    <Column field="email" header={t('tablePartners.columns.email')} />
                    <Column field="" header={t('tablePartners.columns.uploadFlete')} body={processingType_flete}/>
                    <Column field="" header={t('tablePartners.columns.uploadFruta')} body={processingType_compras} />
                </DataTable>
            )}
        </>
    );
};