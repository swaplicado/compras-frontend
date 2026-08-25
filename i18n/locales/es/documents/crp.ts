import payments from "./payments";

const crp = {
    titleAll: "Todos los CRP",
    titleAllTooltip: "Todos los CRP cargados en el sistema, sin importar su estatus actual.",
    titleUpload: "Cargar y revisar CRP",
    titleUploadTooltip: "Cargar nuevos CRP y revisar los CRP pendientes de revisión.",
    titleUploadprovider: "Cargar CRP",
    titleUploadproviderTooltip: "Cargar nuevos CRP.",
    titleAccepted: "CRP revisados",
    titleAcceptedTooltip: "CRP que han sido aceptados en la revisión.",
    titleRejected: "CRP rechazados en la revisión",
    titleRejectedTooltip: "CRP que han sido rechazados en la revisión.",
    titleAllAuth: "CRP en autorización",
    titleAllAuthTooltip: "CRP que han sido aceptados en la revisión y están pendientes de autorización.",
    titleAuthorized: "CRP autorizados",
    titleAuthorizedTooltip: "CRP que han sido autorizados.",
    titleRejectedAuth: "CRP rechazados en la autorización",
    titleRejectedAuthTooltip: "CRP que han sido rechazados en la autorización.",
    titleMyAuth: "Autorizaciones de CRP pendientes para mí",
    titleMyAuthTooltip: "CRP que han sido aceptados en la revisión y están pendientes de mi autorización.",

    textBtnCreate: "Cargar CRP",
    datatable: {
        columns: {
            company : "Empresa",
            date: "Fecha",
            folio: "Folio",
            uuid: "UUID",
            authz_acceptance_name: "Estatus",
            files: "Archivos",
        }
    },
    dialog: {
        uploadTitle: "Carga de CRP",
        viewTitle: "CRP",
        editTitle: "Modificar CRP",
        acceptedTitle: "CRP",
        rejectedTitle: "CRP",
        fields: {
            company: {
                label: "Empresa: *",
                placeholder: "Selecciona la empresa",
                helperText: "Selecciona la empresa a la que pertenece el comprobante de pago.",
                tooltip: "Selecciona la empresa a la que pertenece el comprobante de pago.",
            },
            partner: {
                label: "Proveedor: *",
                placeholder: "Selecciona el proveedor",
                helperText: "Selecciona el proveedor al que pertenece el comprobante de pago.",
                tooltip: "Selecciona el proveedor al que pertenece el comprobante de pago.",
            },
            payment: {
                label: "Pagos: *",
                placeholder: "Selecciona los pagos",
                helperText: "Selecciona los pagos a los que pertenece el comprobante de pago.",
                tooltip: "Selecciona los pagos a los que pertenece el comprobante de pago.",
            },
            area: {
                label: "Área: *",
                placeholder: "Selecciona el área",
                helperText: "Selecciona el área a la que pertenece el comprobante de pago.",
                tooltipSimple: "Área funcional.",
                tooltipAuto: "Selección automática: Única área disponible para este pago.",
                tooltipSelect: "Selecciona un pago primero para cargar las áreas.",
            },
            partner_fiscal_id: {
                label: "RFC del emisor",
                placeholder: "RFC del emisor",
                tooltip: "Este es el RFC del emisor del comprobante de pago."
            },
            company_fiscal_id: {
                label: "RFC del receptor",
                placeholder: "RFC del receptor",
                tooltip: "Este es el RFC del receptor del comprobante de pago."
            },
            receiver_tax_regime: {
                label: "Régimen fiscal del receptor",
                placeholder: "Régimen fiscal del receptor",
                tooltip: "Este es el régimen fiscal del receptor de la NC."
            },
            issuer_tax_regime: {
                label: "Régimen fiscal del emisor",
                placeholder: "Régimen fiscal del emisor",
                tooltip: "Este es el régimen fiscal del emisor de la NC."
            },
            folio: {
                label: "Folio",
                placeholder: "Folio",
                tooltip: "Este es el folio asociado al comprobante de pago."
            },
            date: {
                label: "Fecha",
                placeholder: "Fecha",
                tooltip: "Esta es la fecha de emisión del comprobante de pago."
            },
            xml_file: {
                label: "XML: *",
                tooltip: "Archivo XML del comprobante de pago."
            }
        },
        files: {
            label: "Archivos del comprobante de pago: *",
            placeholderMultiple: "Suelte aquí los archivos para comenzar a cargarlos",
            placeholderSingle: "Suelte el archivo aquí para comenzar a cargarlo",
            helperTextFiles: "Selecciona los archivos del comprobante de pago.",
            helperTextPdf: "Debe cargar la representación impresa en PDF del comprobante de pago.",
            helperTextXml: "Debe cargar un archivo XML.",
            tooltip: "Selecciona los archivos del comprobante de pago.",
            invalidFileSize: "El tamaño máximo por archivo es de 5 MB.",
            invalidFileSizeMessageSummary: "Archivo demasiado grande.",
            invalidFileType: "Solo se permiten archivos PDF, XML, PNG Y JPEG.",
            invalidAllFilesSize: "El tamaño máximo de los archivos es de 25 MB.",
            hasSameFile: "No es necesario volver a cargar el archivo {{xmlName}} en la sección Archivos.",
            hasMatchingPDF: "Es necesario que se cargue la representación impresa en PDF del comprobante de pago y que tenga el mismo nombre que el archivo XML {{xmlBaseName}}.",
        },
        uploadInstructions: {
            header: "Para cargar un comprobante de pagos, sigue estos pasos:",
            step1: "Selecciona uno o varios pagos.",
            step3: "Selecciona el XML del comprobante de pago para su validación, en cuanto selecciones el xml este se validará automáticamente.",
            step4: "Una vez validado el XML, se mostrarán las observaciones del archivo que pudiera contener marcados con un signo de advetencia amarillo, si no contiene errores criticos marcados en rojo y con una X, se mostrarán los campos del archivo XML para que pueda continuar.",
            step5: "Selecciona los archivos asociados al comprobante de pago en el campo 'Archivos de comprobante de pago'.",
            step6: "Asegúrate de que los archivos no superen 5 MB cada uno y que en total no superen los 25 MB.",
            footer: `Puedes seleccionar varios archivos a la vez, pero asegúrate de que al menos uno sea un PDF.
             Si seleccionas archivos que no cumplen con estos requisitos, se mostrará un mensaje de error. `
        },
        uploadInstructionsPartner: {
            header: "Para cargar un comprobante de pagos, sigue estos pasos:",
            step1: "Selecciona uno o varios pagos.",
            step2: "Selecciona el XML del comprobante de pago para su validación, en cuanto selecciones el xml este se validará automáticamente.",
            step3: "Una vez validado el XML, se mostrarán las observaciones del archivo que pudiera contener marcados con un signo de advetencia amarillo, si no contiene errores criticos marcados en rojo y con una X, se mostrarán los campos del archivo XML para que pueda continuar.",
            step4: "Selecciona los archivos asociados al comprobante de pago en el campo 'Archivos de comprobante de pago'.",
            step5: "Asegúrate de que los archivos no superen 5 MB cada uno y que en total no superen los 25 MB.",
            footer: `Puedes seleccionar varios archivos a la vez, pero asegúrate de que al menos uno sea un PDF.
             Si seleccionas archivos que no cumplen con estos requisitos, se mostrará un mensaje de error.`   
        },
        reviewInstructions: {
            header: "Para revisar un comprobante de pagos, sigue estos pasos:",
            step1: "Revisa los archivos PDF y XML del comprobante de pagos.",
            step2: "Si el comprobante es correcto, presiona el botón Aceptar.",
            step3: "Si el comprobante es incorrecta, presiona el botón Rechazar para abrir el campo de comentarios de rechazo.",
            step4: "Ingresa los comentarios de rechazo y vuelve a presionar el botón Rechazar.",
            footer: "Asegúrate de que los comentarios sean claros y específicos para que el proveedor pueda corregir la factura."   
        }
    }
}

export default crp;