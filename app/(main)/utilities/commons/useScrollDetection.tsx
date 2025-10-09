import { Button } from 'primereact/button';
import { useState, useRef, useCallback, useEffect } from 'react';

export const btnScroll = (dialogContentRef: any, visibleElement: any) => {
    const scrollToBottom = () => {
        if (dialogContentRef.current) {
            dialogContentRef.current.scrollTo({
                top: dialogContentRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    return (
    <div className="flex flex-column md:flex-row justify-content-between gap-2 pb-2">
        <div className='pt-6'></div>
        {!visibleElement && (
            <div className="floating-button-container">
                <Button icon="pi pi-arrow-down" className="p-button-rounded p-button-secondary p-button-sm  p-button-help" onClick={scrollToBottom} tooltip="Ir al final" tooltipOptions={{ position: 'left' }} />
            </div>
        )}
    </div>
    )
}