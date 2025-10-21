const nc = {
    titleUpload: "Carga de notas de credito",
    titleUploadTooltip: "Carga de notas de credito",
    titleAccepted: "Notas de credito aceptadas",
    titleAcceptedTooltip: "Notas de credito aceptadas",
    titleRejected: "Notas de credito rechazadas",
    titleRejectedTooltip: "Notas de credito rechazadas",
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
            files: "Archivos"
        }
    },
    dialog: {
        uploadTitle: "Carga de NC",
        viewTitle: "Nota de crédito",
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
            },
            authz_acceptance_notes: {
                label: "Comentarios de aceptación/rechazo:",
                placeholder: "Comentarios de aceptación/rechazo:",
                tooltip: "Comentarios de aceptación/rechazo:",
            }
        },
        files: {
            label: "Archivos de la nota de crédito: *",
            placeholderMultiple: "Suelte los archivos aquí para comenzar a cargarlos",
            placeholderSingle: "Suelte el archivo aquí para comenzar a cargarlo",
            helperTextFiles: "Selecciona los archivos de la nota de crédito.",
            helperTextPdf: "Debe cargar la representación impresa en PDF de la nota de crédito.",
            helperTextXml: "Debe cargar un archivo XML.",
            tooltip: "Selecciona los archivos de la nota de crédito.",
            invalidFileSize: "El tamaño máximo por archivo es de 5 MB.",
            invalidFileSizeMessageSummary: "Archivo demasiado grande.",
            invalidFileType: "Solo se permiten archivos PDF, XML, PNG Y JPEG.",
            invalidAllFilesSize: "El tamaño máximo de los archivos es de 25 MB.",
            hasSameFile: "No es necesario volver a cargar el archivo {{xmlName}} en la sección Archivos.",
            hasMatchingPDF: "Es necesario que se cargue la representación impresa en PDF de la nota de crédito y que tenga el mismo nombre que el archivo XML {{xmlBaseName}}.",
        },
        errors: {
            uploadError: "Error al cargar la nota de crédito. Por favor, verifica los archivos y referencia y vuelve a intentarlo.",
            getReferencesError: "Error al obtener las referencias. Por favor, intenta nuevamente más tarde.",
            updateStatusError: "Error al actualizar el estado de la nota de crédito. Por favor, intenta nuevamente más tarde.",
            uploadValidXmlError: "Error al enviar el xml para su validación.",
            getCurrenciesError: "Error al obtener tipos de cambio.",
            getLInvoicesToReview: "Error al obtener la lista de facturas.",
        },
        animationSuccess: {
            uploadTitle: "Nota de crédito cargada.",
            uploadText: "La nota de crédito se ha cargado correctamente.",
            reviewAcceptedTitle: "Nota de crédito aceptada.",
            reviewAcceptedText: "La nota de crédito se ha aceptado correctamente.",
            reviewRejectedTitle: "Nota de crédito rechazado.",
            reviewRejectedText: "La nota de crédito se ha rechazado correctamente.",
            editTitle: "Nota de crédito editada.",
            editText: "La nota de crédito se ha editado correctamente."
        },
        animationError: {
            uploadTitle: "Error al cargar la nota de crédito.",
            uploadText: "Ocurrió un error al cargar la nota de crédito, vuelve a intentarlo más tarde.",
            reviewAcceptedTitle: "Error al aceptar la nota de crédito.",
            reviewAcceptedText: "Ocurrió un error al aceptar la nota de crédito, vuelve a intentarlo más tarde.",
            reviewRejectedTitle: "Error al rechazar la nota de crédito.",
            reviewRejectedText: "Ocurrió un error al rechazar la nota de crédito, vuelve a intentarlo más tarde.",
            editTitle: "Error al editar la nota de crédito.",
            editText: "Ocurrió un error al editar la nota de crédito, vuelve a intentarlo más tarde."
        },
        uploadInstructions: {
            header: "Para cargar una nota de crédito, sigue estos pasos:",
            step1: "Presiona el botón Cargar NC para abrir el diálogo para cargar la NC.",
            step2: "Selecciona empresa y proveedor para obtener la lista de facturas a seleccionar.",
            step3: "Selecciona las facturas de la NC.",
            step4: "Si seleccionas más de una factura, debes seleccionar el área al cual es dirigida la NC y el monto de cada factura asociada a la NC.",
            step5: "Selecciona el XML de la NC para su validación, en cuanto selecciones el XML de la NC este se validará automáticamente.",
            step6: "Una vez validado y que no se encuentren errores se deben cargar los demás archivos de la NC como son el PDF, el nombre del PDF de la NC debe ser el mismo que el del XML.",
            step7: "Ya que se tengan todos los archivos seleccionados, presiona el botón Cargar para cargar la NC.",
        },
        uploadInstructionsPartner: {
            header: "Para cargar una nota de crédito, sigue estos pasos:",
            step1: "Presiona el botón Cargar NC para abrir el diálogo para cargar la NC.",
            step2: "Selecciona empresa para obtener la lista de facturas a seleccionar.",
            step3: "Selecciona las facturas de la NC.",
            step4: "Si seleccionas más de una factura, debes seleccionar el área al cual es dirigida la NC y el monto de cada factura asociada a la NC.",
            step5: "Selecciona el XML de la NC para su validación, en cuanto selecciones el XML de la NC este se validará automáticamente.",
            step6: "Una vez validado y que no se encuentren errores se deben cargar los demás archivos de la NC como son el PDF, el nombre del PDF de la NC debe ser el mismo que el del XML.",
            step7: "Ya que se tengan todos los archivos seleccionados, presiona el botón Cargar para cargar la NC.",
        },
        reviewInstructions: {
            header: "Para revisar una nota de crédito, sigue estos pasos:",
            step1: "Haz doble clic sobre el renglón de la NC a revisar, se abrirá el diálogo con la información de la NC para revisar.",
            step2: "En la parte inferior del diálogo se encuentra un botón Mostrar archivos, presiona este botón para ver los archivos de la NC.",
            step3: "Para aceptar la NC solo presiona el botón Aceptar.",
            step4: "Para rechazar la NC debes ingresar un comentario con el motivo del rechazo, luego presiona el botón Rechazar."
        },
        editInstructions: {
            header: "Para editar una nota de crédito, sigue estos pasos:",
            step1: "Haz doble clic sobre el renglón correspondiente a la NC a editar, se abrirá el diálogo para editar los archivos de la NC.",
            step2: "En la parte inferior del diálogo se encuentra la lista de archivos cargados en la NC, esta lista se compone por una casilla de verificación seguido del nombre del archivo.",
            step3: "Para conservar un archivo deja marcado la casilla de verificación, para eliminarlo desmarca la casilla de verificación.",
            step4: "Para cargar nuevos archivos en la sección Archivos, presiona el botón Seleccionar para cargar nuevos archivos.",
            step5: "Una vez seleccionados los archivos deseados, presiona el botón Guardar para pasar la NC de rechazada a cargada.",
        },
        deleteInstructions: {
            header: "Para eliminar una nota de crédito, sigue estos pasos:",
            step1: "Identifica el renglón de la NC que deseas eliminar.",
            step2: "En la parte derecha final del renglón de la NC se encuentra el botón Eliminar.",
            step3: "Al presionar el botón Eliminar se abre un diálogo de confirmación.",
            step4: "Revisamos que el folio corresponda con la NC a eliminar y confirmamos presionando el botón Sí.",
        },
        viewInstructions: {
            header: "Para ver una nota de crédito, sigue estos pasos:",
            step1: "Identifica el renglón de la NC que deseas ver.",
            step2: "Haz doble clic sobre el renglón de la NC correspondiente, se abrirá un diálogo con la información de la NC.",
        },
    }
}

export default nc