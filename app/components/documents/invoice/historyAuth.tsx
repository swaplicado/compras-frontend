import React, {useState} from "react";
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import constants from "@/app/constants/constants";
import { useTranslation } from 'react-i18next';

interface HistoryAuthProps {
    lHistory: any[];
}

export const HistoryAuth = ({ 
    lHistory 
}: HistoryAuthProps) => {
    const { t } = useTranslation('payments');
    const { t: tCommon } = useTranslation('common');

    return (
        <div>
            <br />
            <div>
                <label htmlFor="">Historial de autorizaciones</label>
            </div>
            <DataTable
                value={lHistory}
                paginator
                rowsPerPageOptions={constants.TABLE_ROWS}
                className="p-datatable-gridlines"
                rows={constants.TABLE_DEFAULT_ROWS}
                showGridlines
                responsiveLayout="scroll"
                emptyMessage={tCommon('datatable.emptyMessage')}
                scrollable
                scrollHeight="40rem"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                resizableColumns
            >
                <Column field="actioned_by" header="Révisor"/>
                <Column field="status" header="Estatus"/>
                <Column field="notes" header="Notas"/>
                <Column field="actioned_at" header="Fecha"/>
            </DataTable>
        </div>
    )
}