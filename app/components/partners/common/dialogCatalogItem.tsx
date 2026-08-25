import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

interface DialogCatalogItemProps {
    visible: boolean;
    onHide: () => void;
    title: string;
    nameLabel: string;
    name: string;
    setName: (value: string) => void;
    sortOrder: number;
    setSortOrder: (value: number) => void;
    onSave: () => void;
    loading?: boolean;
    submitted?: boolean;
}

export const DialogCatalogItem = ({
    visible,
    onHide,
    title,
    nameLabel,
    name,
    setName,
    sortOrder,
    setSortOrder,
    onSave,
    loading = false,
    submitted = false
}: DialogCatalogItemProps) => {
    const footer = (
        <div className="flex flex-column md:flex-row justify-content-between gap-2">
            <Button label="Cancelar" icon="bx bx-x" onClick={onHide} severity="secondary" disabled={loading} />
            <Button label="Guardar" icon="bx bx-save" onClick={onSave} disabled={loading} />
        </div>
    );

    return (
        <div className="flex justify-content-center">
            <Dialog header={title} visible={visible} onHide={onHide} footer={footer} modal className="p-fluid" style={{ width: '30rem' }}>
                <div className="field">
                    <label htmlFor="catalog_item_name">{nameLabel}</label>
                    <InputText
                        id="catalog_item_name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        maxLength={500}
                        className={classNames({ 'p-invalid': submitted && !name.trim() })}
                    />
                    {submitted && !name.trim() && <small className="p-error">Este campo es obligatorio</small>}
                </div>
                <div className="field">
                    <label htmlFor="catalog_item_sort_order">Orden</label>
                    <InputNumber id="catalog_item_sort_order" value={sortOrder} onValueChange={(e) => setSortOrder(e.value ?? 0)} showButtons min={0} />
                </div>
            </Dialog>
        </div>
    );
};