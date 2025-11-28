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
            <div className="flex flex-column">
                <div className='flex flex-column align-items-center'>
                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '5rem', color: '#FFC107' }}></i>
                    <h3>¡Atención!</h3>
                    <p>Se encontraron errores en las siguientes facturas:</p>
                </div>
                    {lMessage.map((array, index) => (
                        array.length > 0 && (
                            <div key={index}>
                                <h4>Factura: {index + 1}</h4>
                                <ul>
                                    {
                                        array.map((value: any, index2: number) => (
                                            <li key={'list_'+index2}>{String(value)}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        )
                    ))}
                <div className='flex flex-column align-items-center'>
                    <p>Por favor, corrige los errores y vuelve a intentarlo.</p>
                </div>
            </div>
        )
    }

    const renderUploadMessage = () => {
        return (
            <>
                <div className="flex flex-column">
                    <div className='flex flex-column align-items-center'>
                        <i className="pi pi-times" style={{ fontSize: '5rem', color: '#EF4444' }}></i>
                        <h3>¡Error!</h3>
                        <p>Se encontraron errores en las siguientes facturas:</p>
                    </div>
                    {lMessage.map((array, index) => (
                        array?.length > 0 && (
                            <div key={index}>
                                <h4>Factura: {index + 1}</h4>
                                <ul>
                                    {
                                        array.map((value: any, index2: number) => (
                                            <li key={'list_'+index2}>{String(value)}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        )
                    ))}
                    <div className='flex flex-column align-items-center'>
                        <p>Comunicate con soporte.</p>
                    </div>
                </div>
                { succesInvoices.length > 1 && (
                    <div className="flex flex-column">
                        <div className='flex flex-column align-items-center'>
                            <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: '#4CAF50' }}></i>
                            <h3>¡Éxito!</h3>
                            <p>Se han subido las siguientes facturas:</p>
                        </div>
                        <ul>
                            {
                                succesInvoices.map((value: any, index: number) => (
                                    <li key={'list_'+index}>{String(value)}</li>
                                ))
                            }
                        </ul>
                        <div className='flex flex-column align-items-center'>
                            <p>Las facturas se han subido correctamente.</p>
                        </div>
                    </div>
                )}
            </>
        )
    }

    return (
        <Dialog
            header={''}
            visible={visible}
            onHide={onHide}
            footer={
                <div className='flex align-content-start'>
                    <Button label="Cerrar" severity='secondary' onClick={onHide} />
                </div>
            }
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
        >
            { type == 'validate' && (
                renderValidateMessage()
            )}
            { type == 'upload' && (
                renderUploadMessage()
            )}
        </Dialog>
    )
}