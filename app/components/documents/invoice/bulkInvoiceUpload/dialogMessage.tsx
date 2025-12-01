import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";

interface DialogMessageProps {
    type: 'validate' | 'upload' | null;
    visible: boolean;
    onHide: () => void;
    lMessage: Array<any>;
    succesInvoices?: Array<any>;
}

export const DialogMessage = ({
    type,
    visible,
    onHide,
    lMessage,
    succesInvoices = []
}: DialogMessageProps) =>  {

    const renderValidateMessage = () => {
        return (
            <div className="flex flex-column gap-3">

                {/* Encabezado */}
                <div className='flex flex-column align-items-center mb-3'>
                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '4rem', color: '#FFC107' }}></i>
                    <h2 className="mt-2 mb-1">¡Atención!</h2>
                    <p className="text-center">Se encontraron errores en las siguientes facturas:</p>
                </div>

                {/* Listado de errores */}
                {lMessage.map((array, index) => (
                    array.length > 0 && (
                        <div key={index} className="mb-3">
                            <h4 className="mb-2">Factura {index + 1}</h4>
                            <ul className="pl-3">
                                {array.map((value: any, index2: number) => (
                                    <li key={'list_'+index2}>{String(value)}</li>
                                ))}
                            </ul>
                        </div>
                    )
                ))}

                {/* Pie del mensaje */}
                <div className='flex flex-column align-items-center mt-3'>
                    <p className="text-center">Por favor corrige los errores y vuelve a intentarlo.</p>
                </div>
            </div>
        );
    };

    const renderUploadMessage = () => {
        const hasErrors = lMessage.some(array => array && array.length > 0);
        const hasSuccess = succesInvoices.length > 0;

        return (
            <div className="flex flex-column gap-4">

                {/* BLOQUE DE ERRORES */}
                {hasErrors && (
                    <div className="flex flex-column gap-3 pb-3 border-bottom-1 surface-border">

                        <div className='flex flex-column align-items-center'>
                            <i className="pi pi-times" style={{ fontSize: '4rem', color: '#EF4444' }}></i>
                            <h2 className="mt-2 mb-1">¡Error!</h2>
                            <p className="text-center">Se encontraron errores en las siguientes facturas:</p>
                        </div>

                        {lMessage.map((array, index) => (
                            array?.length > 0 && (
                                <div key={index}>
                                    <h4 className="mb-2">Factura número {index + 1}:</h4>
                                    <ul className="pl-3">
                                        {array.map((value: any, index2: number) => (
                                            <li key={'list_'+index2}>{String(value)}</li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        ))}

                        <div className='flex flex-column align-items-start mt-2'>
                            <p className="text-center">Comunícate con soporte.</p>
                        </div>

                    </div>
                )}

                {/* BLOQUE DE ÉXITO */}
                {hasSuccess && (
                    <div className="flex flex-column gap-3">

                        <div className='flex flex-column align-items-center'>
                            <i className="pi pi-check-circle" style={{ fontSize: '4rem', color: '#4CAF50' }}></i>
                            <h2 className="mt-2 mb-1">¡Éxito!</h2>
                        </div>

                        <p className="mb-1">Se han subido las siguientes facturas:</p>

                        <p className="font-medium">
                            {succesInvoices.map((value: any, index: number) => (
                                `Factura número ${value + 1}${index + 1 < succesInvoices.length ? ', ' : ''}`
                            ))}
                        </p>

                        <div className='flex flex-column align-items-start mt-2'>
                            <p className="text-center">Las facturas se han subido correctamente.</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog
            header=""
            visible={visible}
            onHide={onHide}
            footer={
                <div className='flex justify-content-end'>
                    <Button label="Cerrar" severity='secondary' onClick={onHide} />
                </div>
            }
            pt={{
                header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' },
                content: {
                    style: {
                        maxHeight: '70vh',
                        overflow: 'auto'
                    }
                },
            }}
        >
            { type === 'validate' && renderValidateMessage() }
            { type === 'upload' && renderUploadMessage() }
        </Dialog>
    );
};
