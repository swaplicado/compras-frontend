const nc = {
    titleUpload: "Carga de notas de credito",
    titleAccepted: "Notas de credito aceptadas",
    titleRejected: "Notas de credito rechazadas",
    textBtnCreate: "Cargar NC",
    datatable: {
        columns: {
            priority: "Prioridad",
            company_trade_name: "Empresa",
            partner_full_name: "Proveedor",
            folio: "Folio",
            amount: "Monto",
            currency_code: "Moneda",
            date: "Fecha",
            authz_acceptance_name: "Aceptación",
            authz_authorization_name: "Autorización",
        }
    },
    dialog: {
        uploadTitle: "Carga de NC",
        viewTitle: "NC",
        editTitle: "Editar NC",
        acceptedTitle: "NC",
        rejectedTitle: "NC",
        fields: {
            company: {
                label: "Empresa:",
                placeholder: "Empresa",
                tooltip: "Empresa"
            },
            partner: {
                label: "Proveedor:",
                placeholder: "Proveedor",
                tooltip: "Proveedor"
            },
            lInvoices: {
                label: "Facturas:",
                placeholder: "Facturas",
                tooltip: "Facturas"
            },
            lAreas: {
                label: "Área:",
                placeholder: "Área",
                tooltip: "Área"
            },
            date: {
                label: "Fecha",
                placeholder: "Fecha",
                tooltip: "Fecha"
            },
            folio: {
                label: "Folio",
                placeholder: "Folio",
                tooltip: "Folio"
            },
            uuid: {
                label: "UUID",
                placeholder: "UUID",
                tooltip: "UUID"
            },
            files: {
                label: "Archivos",
                placeholder: "Archivos",
                tooltip: "Archivos"
            },
            partner_fiscal_id: {
                label: "RFC del emisor",
                placeholder: "RFC del emisor",
                tooltip: "RFC del emisor"
            },
            company_fiscal_id: {
                label: "RFC del receptor",
                placeholder: "RFC del receptor",
                tooltip: "RFC del receptor"
            },
            receiver_tax_regime: {
                label: "Regimen fiscal del receptor",
                placeholder: "Regimen fiscal del receptor",
                tooltip: "Regimen fiscal del receptor"
            },
            issuer_tax_regime: {
                label: "Regimen fiscal del emisor",
                placeholder: "Regimen fiscal del emisor",
                tooltip: "Regimen fiscal del emisor"
            },
            amount: {
                label: "Monto",
                placeholder: "Monto",
                tooltip: "Monto"
            },
            currency: {
                label: "Moneda",
                placeholder: "Moneda",
                tooltip: "Moneda"
            },
            exchange_rate: {
                label: "Tipo de cambio",
                placeholder: "Tipo de cambio",
                tooltip: "Tipo de cambio"
            }
        },
        files: {
            label: "Archivos de factura: *",
            placeholderMultiple: "Suelte los archivos aquí para comenzar a cargarlos",
            placeholderSingle: "Suelte el archivo aquí para comenzar a cargarlo",
            helperTextFiles: "Selecciona los archivos de la factura.",
            helperTextPdf: "Debe cargar la representación impresa en PDF del comprobante.",
            helperTextXml: "Debe cargar un archivo XML.",
            tooltip: "Selecciona los archivos de la factura (PDF y XML).",
            invalidFileSize: "El tamaño máximo por archivo es de 5 MB.",
            invalidFileSizeMessageSummary: "Archivo demasiado grande.",
            invalidFileType: "Solo se permiten archivos PDF, XML, PNG Y JPEG.",
            invalidAllFilesSize: "El tamaño máximo de los archivos es de 25 MB.",
            hasSameFile: "No es necesario volver a cargar el archivo {{xmlName}} en la sección Archivos.",
            hasMatchingPDF: "Es necesario que se cargue la representación impresa en PDF del comprobante y que tenga el mismo nombre que el archivo XML {{xmlBaseName}}.",
        },
        errors: {
            uploadError: "Error al cargar la nota de crédito. Por favor, verifica los archivos y referencia y vuelve a intentarlo.",
            getReferencesError: "Error al obtener las referencias. Por favor, intenta nuevamente más tarde.",
            updateStatusError: "Error al actualizar el estado de la factura. Por favor, intenta nuevamente más tarde.",
            uploadValidXmlError: "Error al enviar el xml para su validación.",
            getCurrenciesError: "Error al obtener tipos de cambio."
        },
        animationSuccess: {
            title: "Nota de crédito cargada.",
            text: "La nota de crédito se ha cargado correctamente.",
            titleReview: "Nota de crédito revisada.",
        },
        animationError: {
            title: "Error al cargar la nota de crédito.",
            text: "Ocurrió un error al cargar la nota de crédito, vuelve a intentarlo más tarde.",
            titleReview: "Error al revisar la nota de crédito.",
        }
    }
}

export default nc