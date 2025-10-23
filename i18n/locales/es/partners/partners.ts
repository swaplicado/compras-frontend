const partners = {
    reviewInstructions: {
        header: "Para revisar un proveedor sigue estos pasos:",
        step1: "Identifica el renglón del proveedor que deseas revisar.",
        step2: "Haz doble clic sobre el renglón del proveedor correspondiente, se abrirá un diálogo con la información del proveedor.",
        step3: "En la parte inferior del diálogo se encuentra un botón Mostrar archivos, presiona este botón para ver los archivos del proveedor.",
        step4: `Para aceptar al proveedor solo presiona el botón Aceptar y pasará a la sección del menu Aceptados donde tendras que enviarlo a autorización 
                ó si lo prefieres puedes aceptar y enviar a autorizar presionando el boton Aceptar y enviar, y pasara a estar en autorización.`,
        step5: "Para rechazar al proveedor debes ingresar un comentario con el motivo del rechazo, luego presiona el botón Rechazar."
    },
    sendAuthInstructions: {
        header: "Para enviar a autorizar:",
        step1: "Identifica el renglón del proveedor que deseas enviar a autorizar.",
        step2: "Haz doble clic sobre el renglón del proveedor correspondiente, se abrirá un diálogo con la información del proveedor.",
        step3: `Para enviar a autorizar al proveedor solo presiona el botón Enviar a autorizar.`,
    },
    authInstructions: {
        header: "Para autorizar un proveedor sigue estos pasos:",
        step1: "Identifica el renglón del proveedor que deseas autorizar.",
        step2: "Haz doble clic sobre el renglón del proveedor correspondiente, se abrirá un diálogo con la información del proveedor.",
        step3: "En la parte inferior del diálogo se encuentra un botón Mostrar archivos, presiona este botón para ver los archivos del proveedor.",
        step4: "Para autorizar al proveedor solo presiona el botón Autorizar.",
        step5: "Para rechazar al proveedor debes ingresar un comentario con el motivo del rechazo, luego presiona el botón Rechazar."
    },
    register: {
        listFiles: {
            file1: {
                name: 'Opinión del cumplimiento de obligaciones fiscales',
                description: 'Documento emitido por el SAT donde se indica si estás al corriente con tus obligaciones fiscales. Puedes obtenerlo desde tu buzón tributario.'
            },
            file2: {
                name: 'Constancia de situación fiscal',
                description: 'Es el documento del SAT que muestra tu RFC, domicilio fiscal y régimen. Nos ayuda a validar tu información fiscal.'
            },
            file3: {
                name: 'Comprobante de domicilio',
                description: 'Sube un recibo reciente (máximo 3 meses) que muestre tu dirección fiscal. Puede ser de electricidad, agua, teléfono o un estado de cuenta bancario.'
            },
            file4: {
                name: 'Carátula de estado de cuenta bancario',
                description: 'Solo necesitamos la primera hoja donde aparezca tu nombre, número de cuenta y CLABE. No es necesario incluir los movimientos.'
            },
            file5: {
                name: 'Carta de confirmación de datos proporcionados',
                description: 'Es un documento en formato libre firmado donde confirmas que la información que entregaste es correcta y está actualizada.'
            }
        }
    }
}

export default partners;