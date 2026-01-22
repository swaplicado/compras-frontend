import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RenderField } from '@/app/components/commons/renderField';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/app/(main)/utilities/documents/common/currencyUtils';
import constants from '@/app/constants/constants';
import { CustomFileViewer } from '@/app/components/documents/invoice/fileViewer';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { FileUpload } from 'primereact/fileupload';
import { Messages } from 'primereact/messages';
import axios from 'axios';
import DateFormatter from '@/app/components/commons/formatDate';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';
import { btnScroll } from '@/app/(main)/utilities/commons/useScrollDetection';
import { useIntersectionObserver } from 'primereact/hooks';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { Accordion, AccordionTab } from 'primereact/accordion';

interface CrpFieldsProps {
    oCrp: any;
    loadingCrp: boolean;
    lFilesCrp: any[];
}

export const CrpFields = ({
    oCrp,
    loadingCrp,
    lFilesCrp
}: CrpFieldsProps) => {
    const { t } = useTranslation('payments');
    const { t: tCommon } = useTranslation('common');

    return (
        <Accordion>
                <AccordionTab header="Comprobante de recepción de pago">
                    <div className="p-fluid formgrid grid">
                        <RenderField
                            label={'Empresa'}
                            tooltip={'Empresa'}
                            value={oCrp?.company.name}
                            disabled={true}
                            mdCol={6}
                            type={'text'}
                            onChange={(value: any) => {}}
                            options={[]}
                            placeholder={'Selecciona empresa'}
                            errorKey={''}
                            errors={{}}
                            errorMessage={''}
                        />
                        <RenderField
                            label={"Proveedor"}
                            tooltip={"Proveedor"}
                            value={oCrp?.partner.name}
                            disabled={true}
                            mdCol={6}
                            type={'text'}
                            onChange={(value) => {}}
                            options={[]}
                            placeholder={"Selecciona proveedor"}
                            errorKey={""}
                            errors={[]}
                            errorMessage={""}
                        />
                        <RenderField
                            label={'Area'}
                            tooltip={'Area'}
                            value={oCrp?.functional_area.name}
                            disabled={true}
                            mdCol={6}
                            type={'text'}
                            onChange={(value) => {}}
                            options={[]}
                            placeholder={'Selecciona area'}
                            errorKey={'area'}
                            errors={[]}
                            errorMessage={'Selecciona area'}
                        />
                        <RenderField
                            label={"RFC emisor:"}
                            tooltip={"RFC emisor:"}
                            value={oCrp?.partner.fical_id}
                            disabled={true}
                            mdCol={6}
                            type={"text"}
                            onChange={(value) => {}}
                            options={[]}
                            placeholder={""}
                            errorKey={""}
                            errors={[]}
                            errorMessage={""}
                        />
                        <RenderField
                            label={"Régimen fiscal emisor:"}
                            tooltip={"Régimen fiscal emisor:"}
                            value={oCrp?.issuer_tax_regime?.name}
                            disabled={true}
                            mdCol={6}
                            type={"text"}
                            onChange={(value) => {}}
                            options={[]}
                            placeholder={""}
                            errorKey={""}
                            errors={[]}
                            errorMessage={""}
                        />
                        <RenderField
                            label={"Folio:"}
                            tooltip={"UUID:"}
                            value={oCrp?.folio}
                            disabled={true}
                            mdCol={6}
                            type={"text"}
                            onChange={(value) => {}}
                            options={[]}
                            placeholder={""}
                            errorKey={""}
                            errors={[]}
                            errorMessage={""}
                        />
                        <RenderField
                            label={"Fecha:"}
                            tooltip={"Fecha:"}
                            value={DateFormatter(oCrp?.date)}
                            disabled={true}
                            mdCol={6}
                            type={'text'}
                            onChange={(value) => {}}
                            options={[]}
                            placeholder={""}
                            errorKey={""}
                            errors={[]}
                            errorMessage={""}
                        />
                    </div>
                    <CustomFileViewer lFiles={lFilesCrp} />
                </AccordionTab>
            </Accordion>
    )
}