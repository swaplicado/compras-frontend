import React, { useState } from 'react';
import { InputNumber, InputNumberProps, InputNumberChangeEvent } from 'primereact/inputnumber';

export const CustomInputNumber = (props: InputNumberProps) => {
    // Creamos un estado local solo para saber si el usuario está dentro del campo
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true); // Encendemos el foco
        if (props.onFocus) {
            props.onFocus(e);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false); // Apagamos el foco
        
        // Si el usuario borró todo y se sale,
        const val: any = props.value;
        const isEmpty = val === null || val === undefined || val === '';
        
        if (isEmpty && props.onChange) {
            props.onChange({
                originalEvent: e as any,
                value: 0,
                target: { name: props.name || '', id: props.id || '', value: 0 }
            } as InputNumberChangeEvent);
        }

        if (props.onBlur) {
            props.onBlur(e);
        }
    };

    let displayValue = props.value;
    const val: any = props.value;
    
    const isEmpty = val === null || val === undefined || val === '';
    const isZero = !isEmpty && Number(val) === 0;

    if (isFocused && isZero) {
        // Si tiene valor 0 y tiene el foco -> Se vacía visualmente.
        displayValue = null;
    } else if (!isFocused && (isEmpty || isZero)) {
        // Si no tiene el foco, y se quedó vacío o en cero -> Se fuerza a mostrar 0.
        displayValue = 0;
    }
    // Si tiene cualquier otro valor, displayValue se queda intacto y el cursor parpadea donde se dio clic.

    return (
        <InputNumber
            {...props}
            value={displayValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
        />
    );
};