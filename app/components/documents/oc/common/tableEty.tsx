import React, {useState, useEffect} from "react";
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import constants from '@/app/constants/constants';
import { useTranslation } from 'react-i18next';
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { FormateadorMonetario }  from '@/app/(main)/utilities/documents/common/currencyUtils';
import DateFormatter from '@/app/components/commons/formatDate';

interface tableEtyProps {
    lEtys: any[];
}

export const TableEty = ({ lEtys }: tableEtyProps) => {
    const { t } = useTranslation('oc');
    const { t: tCommon } = useTranslation('common');
    const [visible, setVisible] = useState<boolean>(false);

    const [oItemH, setOItemH] = useState<any>(null);

    const variationTemplate = (row: any) => {
        return (
            <Button
                type="button"
                icon="pi pi-list"
                size="small"
                onClick={() => { setOItemH(row.lItemHistory[0]); setVisible(true)}}
            />
        )
    }

    const prevPriceTemplate = (row: any) => {
        return (
            <>
                {FormateadorMonetario(row.prevPrice)}
            </>
        )
    }
    const priceTemplate = (row: any) => {
        return (
            <>
                {FormateadorMonetario(row.price)}
            </>
        )
    }
    const subtotalTemplate = (row: any) => {
        return (
            <>
                {FormateadorMonetario(row.subtotal)}
            </>
        )
    }
    const taxChargedTemplate = (row: any) => {
        return (
            <>
                {FormateadorMonetario(row.taxCharged)}
            </>
        )
    }
    const taxRetainedTemplate = (row: any) => {
        return (
            <>
                {FormateadorMonetario(row.taxRetained)}
            </>
        )
    }
    const totalTemplate = (row: any) => {
        return (
            <>
                {FormateadorMonetario(row.total)}
            </>
        )
    }

    const dialogVariationFooter = 
        <div className="flex flex-column md:flex-row justify-content-between gap-2">
            <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={() => setVisible(false)} severity="secondary" />
        </div>
    

    return (
        <>
            <Dialog
                header={'Datos de la compra anterior'}
                visible={visible}
                onHide={() => setVisible(false)}
                footer={dialogVariationFooter}
                position="top"
            >
                <table className="p-datatable p-datatable-gridlines">
                    <tbody className="p-datatable-tbody">
                        <tr>
                            <td className="font-bold">Clave</td>
                            <td>{ oItemH?.conceptKey }</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Concepto</td>
                            <td>{ oItemH?.concept }</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Precio un. actual</td>
                            <td>{ FormateadorMonetario(oItemH?.currentPriceUnitary) + ' MXN'}</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Precio un. anterior</td>
                            <td>{ FormateadorMonetario(oItemH?.priceUnitary) + ' ' + oItemH?.currencySymbol }</td>
                        </tr>
                        <tr>
                            <td className="font-bold">% Variación</td>
                            <td>{ FormateadorMonetario(oItemH?.percentage) }</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Cantidad</td>
                            <td>{ FormateadorMonetario(oItemH?.quantity) }</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Unidad</td>
                            <td>{ oItemH?.unitSymbol }</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Proveedor</td>
                            <td>{ oItemH?.lastProvider }</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Factura</td>
                            <td>{ !! oItemH?.numFact ? oItemH?.numFact : '' }</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Fecha</td>
                            <td>{ DateFormatter(oItemH?.lastPurchaseDate) }</td>
                        </tr>
                    </tbody>
                </table>
            </Dialog>
            <DataTable
                value={lEtys}
                paginator
                rowsPerPageOptions={constants.TABLE_ROWS}
                className="p-datatable-gridlines"
                rows={constants.TABLE_DEFAULT_ROWS}
                showGridlines
                responsiveLayout="scroll"
                emptyMessage={tCommon('datatable.emptyMessage')}
                scrollable
                scrollHeight="40rem"
                sortField=""
                sortOrder={-1}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                resizableColumns
            >
                <Column field="idYear" header="id" hidden />
                <Column field="conceptKey" header={t('dialog.tableEtys.columns.cve')} />
                <Column field="concept" header={t('dialog.tableEtys.columns.concept')} />
                <Column field="quantity" header={t('dialog.tableEtys.columns.amount')} />
                <Column field="unitSymbol" header={t('dialog.tableEtys.columns.unit')} />
                <Column field="prevPrice" header={t('dialog.tableEtys.columns.previus_price')} body={prevPriceTemplate} />
                <Column field="lItemHistory" header={t('dialog.tableEtys.columns.variation')} body = {variationTemplate} />
                <Column field="price" header={t('dialog.tableEtys.columns.unit_price')} body={priceTemplate} />
                <Column field="subtotal" header={t('dialog.tableEtys.columns.subtotal')} body={subtotalTemplate} />
                <Column field="taxCharged" header={t('dialog.tableEtys.columns.transferred_tax')} body={taxChargedTemplate} />
                <Column field="taxRetained" header={t('dialog.tableEtys.columns.withheld_tax')} body={taxRetainedTemplate} />
                <Column field="total" header={t('dialog.tableEtys.columns.total')} body={totalTemplate} />
                <Column field="currency" header={t('dialog.tableEtys.columns.currency')} />
                <Column field="costCenter" header={t('dialog.tableEtys.columns.center_cost')} />
            </DataTable>
        </>
    )
}