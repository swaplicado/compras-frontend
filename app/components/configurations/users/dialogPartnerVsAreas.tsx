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
import { Dialog } from 'primereact/dialog';
import { PickList } from 'primereact/picklist';

interface DialogPartnerVsAreasProps {
    lAreas: any[];
    visible: boolean;
    onHide: () => void;
    oPartner: any;
    onSave: (assignedAreas: any[], partner_id: number) => void;
}
export const DialogPartnerVsAreas = ({
    lAreas,
    visible,
    onHide,
    oPartner,
    onSave
}: DialogPartnerVsAreasProps) => {
    const { t } = useTranslation('configUsers');
    const { t: tCommon } = useTranslation('common');
    const isMobile = useIsMobile();
    const [source, setSource] = useState<Array<any>>([]);
    const [target, setTarget] = useState<Array<any>>([]);

    const dialogFooterContent = () => {
        return (
            <div className="flex flex-column md:flex-row justify-content-between gap-2">
                <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={onHide} severity="secondary" />
                <Button label={tCommon('btnSave')} icon="bx bx-save" onClick={() => { onSave(target, oPartner.id) }} />
            </div>
        )
    }

    const dialogHeaderContent = () => {
        return (
            <div className="text-xl font-bold text-900">
                {oPartner?.full_name}
            </div>
        )
    }

    const onChange = (event: any) => {
        setSource(event.source);
        setTarget(event.target);
    };

    useEffect(() => {
        if (visible) {
            const targetAreas = oPartner.areas;
            const sourceAreas = lAreas.filter(
                (area) => !targetAreas.some((t: any) => t.id === area.id)
            );

            setTarget(targetAreas);
            setSource(sourceAreas);
        }
    }, [visible])
    
    return (
        <div className="flex justify-content-center">
            <Dialog
                header={dialogHeaderContent}
                visible={visible}
                onHide={onHide}
                footer={dialogFooterContent}
                pt={{ 
                    header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' },
                    content: {
                        style: {
                            position: 'relative',
                            maxHeight: '70vh',
                            overflow: 'auto'
                        }
                    },
                }}
                style={{ width: isMobile ? '100%' : '70rem' }}
            >
                <div>
                    <PickList
                        source={source}
                        target={target}
                        sourceHeader={t('dialogPartnerAreas.sourceAreas')}
                        targetHeader={t('dialogPartnerAreas.targetAreas')}
                        onChange={onChange}
                        itemTemplate={(item) => item.name}
                    />
                </div>
            </Dialog>
        </div>
    )
}