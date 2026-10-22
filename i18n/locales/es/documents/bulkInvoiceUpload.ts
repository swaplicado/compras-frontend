const bulkInvoiceUpload = {
    title: "Recepción masiva de facturas",
    titleTooltip: "Pantalla para la carga masiva de facturas.",
    
    // Filtros y formulario principal
    options: {
        freights: "Fletes",
        purchases: "Compras"
    },
    invoiceNumber: "Factura número {{number}}:",
    doPayment: "Realizar pago",
    
    // Labels
    labels: {
        invoiceType: "Selecciona tipo de factura:",
        provider: "Proveedor:",
        taxRegime: "Régimen fiscal:",
        folio: "Folio:",
        date: "Fecha:",
        total: "Total:",
        currency: "Moneda:",
        xmlFile: "Archivo XML: *",
        pdfFile: "Archivo PDF: *",
        tickets: "Boletos: *",
        additionalFiles: "Archivos adicionales:",
        notes: "Descripción de la factura:",
        paymentDate: "Fecha de pago: *",
        paymentInstructions: "Instrucciones de pago:"
    },

    // Tooltips y Placeholders
    tooltips: {
        validate: "Validar los datos de la factura, sus documentos y los boletos seleccionados.",
        xmlFile: "Archivo XML de la factura.",
        pdfFile: "Archivo PDF de la factura.",
        tickets: "Referencias de los boletos asociados a la factura.",
        additionalFiles: "Archivos adicionales.",
        notes: "Descripción de la factura.",
        paymentDate: "Fecha de pago para esta factura.",
        paymentDateAll: "Fecha de pago para todas las facturas de esta carga.",
        paymentInstructions: "Instrucciones del comprador para esta factura.",
        removeInvoice: "Quitar esta factura de la lista de carga.",
        addInvoice: "Agregar una nueva factura a la lista de carga."
    },
    placeholders:{
        paymentDate: "Seleccione fecha de pago",
    },

    // Botones de acción
    buttons: {
        validate: "Validar",
        save: "Guardar"
    },

    // Errores de validación y Axios
    errors: {
        missingPdf: "Falta el archivo PDF de la factura.",
        missingXml: "Falta el archivo XML de la factura.",
        missingNotes: "Falta descripción de la factura.",
        missingPaymentDate: "Falta fecha de pago.",
        missingTicket: "El campo de Boletos está vacío. Selecciona al menos una referencia.",
        invalidXml: "El archivo XML no es válido.",
        validateTicketXml: "Error al validar los datos del boleto contra el XML.",
        getReferences: "Error al obtener las referencias.",
        saveInvoice: "Error al guardar la factura.",
        popInvoice: "Debe mantener al menos una factura en la lista para continuar."
    },

    helperMessages: {
        putPdf: "Por favor, ingrese un archivo PDF",
        paymentDate: "Por favor, seleccione una fecha de pago.",
    },

    // Mensajes de éxito
    success: {
        validationTitle: "Éxito",
        validationMessage: "Validación exitosa."
    },

    // Validaciones de archivos (con interpolación de variables)
    hasMatchingPDF: "Es necesario que se cargue la representación impresa en PDF de la factura y que tenga el mismo nombre que el archivo XML: {{xmlBaseName}}.",
    hasSameFile: "No es necesario volver a cargar el archivo {{xmlName}} en la sección Archivos adicionales.",

    // Instrucciones de carga
    viewInstructions: {
        uploadFreightInvoices: {
            header: "Cargar facturas:",
            step1: "Selecciona el tipo de factura(s) que deseas cargar.",
            step2: "Aparecerán los campos para cargar los documentos de la factura.",
            step3: "Puede establecer una fecha de pago general usando el campo superior, o asignarla de manera individual dentro de cada factura.",
            step4: "Seleccione el XML de la factura. Al subirlo, el sistema lo validará automáticamente.",
            step5: "Una vez validado el XML, se mostrarán las observaciones que pueda contener. Si el archivo no contiene errores críticos, identificados con un ícono rojo y una X, se mostrarán los datos del XML para que pueda continuar.",
            step6: "Seleccione el archivo PDF de la factura. Debe tener exactamente el mismo nombre base que el archivo XML.",
            step7: "Solo para fletes: Seleccione las referencias de los boletos asociados a la factura.",
            step8: "Solo para fletes: De clic en el botón 'Validar' para verificar su correspondencia con el XML y así activar el botón de 'Guardar'.",
            step9: "Ingrese el resto de los datos de la factura. Los campos marcados con un * son obligatorios.",
            step10: "Si desea agregar otra factura a la carga, haga clic en el botón '+' ubicado en la parte inferior y repita los pasos anteriores para cada factura.",
            step11: "Al terminar, haga clic en 'Guardar'. Se hará una validación final y, si todo es correcto, un mensaje de éxito confirmará que las facturas han sido registradas."
        },
    },

    // Selectores auxiliares
    supplier: {
        label: "Alias de proveedor:",
        placeholder: "Alias de proveedor",
        tooltip: "Alias de proveedor"
    },
    zone: {
        label: "Zona fruta:",
        placeholder: "Zona fruta",
        tooltip: "Zona fruta"
    }
}

export default bulkInvoiceUpload;