const prepay = {
    titleUpload: "Carga de proformas",
    titleUploadTooltip: "Carga de proformas",
    titleAccepted: "Proformas aceptadas",
    titleAcceptedTooltip: "Proformas aceptadas",
    titleRejected: "Proformas rechazadas",
    titleRejectedTooltip: "Proformas rechazadas",
    titleAuthNc: "Autorización de proformas",
    titleAuthorizedNc: "Proformas autorizadas",
    titleAuthorizedNcTooltip: "Proformas autorizadas",
    titleInProcessNc: "Proformas en proceso de autorización",
    titleInProcessNcTooltip: "Proformas en proceso de autorización",
    titleRejectedNc: "Proformas rechazadas",
    titleRejectedNcTooltip: "Proformas rechazadas",
    textBtnCreate: "Cargar proforma",
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
        uploadTitle: "Carga de proforma",
        viewTitle: "Proforma",
        editTitle: "Editar proforma",
        acceptedTitle: "Proforma",
        rejectedTitle: "Proforma",
        fields: {
            areas: {
                label: "Área:",
                placeholder: "Área",
                tooltip: "Área",
                helperText: "Área",
                placeholderEmpty: "Sin área",
                helperTextEmpty: "Sin área",
                errorKey: "areas",
                errorMessage: "Selecciona área"
            },
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
                placeholder: "Folio (Identificador del pago)",
                tooltip: "Identificador del registro"
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
                label: "Régimen fiscal del receptor",
                placeholder: "Régimen fiscal del receptor",
                tooltip: "Régimen fiscal del receptor"
            },
            issuer_tax_regime: {
                label: "Régimen fiscal del emisor",
                placeholder: "Régimen fiscal del emisor",
                tooltip: "Régimen fiscal del emisor"
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
            },
            authz_authorization_notes: {
                label: "Comentarios de autorización/rechazo:",
                placeholder: "Comentarios de autorización/rechazo:",
                tooltip: "Comentarios de autorización/rechazo:",
            },
            reference: {
                label: "Referencia: *",
                placeholder: "Referencia",
                tooltip: "Referencia",
                helperText: "Selecciona la referencia de la proforma.",
                placeholderEmpty: "Sin referencia",
                withOutReferenceOption: "Sin referencia"
            }
        },
        files: {
            label: "Archivos de la proforma: *",
            placeholderMultiple: "Suelte los archivos aquí para comenzar a cargarlos",
            placeholderSingle: "Suelte el archivo aquí para comenzar a cargarlo",
            helperTextFiles: "Selecciona los archivos de la proforma.",
            helperTextPdf: "Debe cargar la representación impresa en PDF de la proforma.",
            helperTextXml: "Debe cargar un archivo XML.",
            tooltip: "Selecciona los archivos de la proforma.",
            invalidFileSize: "El tamaño máximo por archivo es de 5 MB.",
            invalidFileSizeMessageSummary: "Archivo demasiado grande.",
            invalidFileType: "Solo se permiten archivos PDF, XML, PNG Y JPEG.",
            invalidAllFilesSize: "El tamaño máximo de los archivos es de 25 MB.",
            hasSameFile: "No es necesario volver a cargar el archivo {{xmlName}} en la sección Archivos.",
            hasMatchingPDF: "Es necesario que se cargue la representación impresa en PDF de la proforma y que tenga el mismo nombre que el archivo XML {{xmlBaseName}}.",
        },
        errors: {
            uploadError: "Error al cargar la proforma. Por favor, verifica los archivos y referencia y vuelve a intentarlo.",
            getReferencesError: "Error al obtener las referencias. Por favor, intenta nuevamente más tarde.",
            updateStatusError: "Error al actualizar el estado de la proforma. Por favor, intenta nuevamente más tarde.",
            uploadValidXmlError: "Error al enviar el XML para su validación.",
            getCurrenciesError: "Error al obtener tipos de cambio.",
            getLInvoicesToReview: "Error al obtener la lista de facturas.",
        },
        animationSuccess: {
            uploadTitle: "Proforma cargada.",
            uploadText: "La proforma se ha cargado correctamente.",
            reviewAcceptedTitle: "Proforma aceptada.",
            reviewAcceptedText: "La proforma se ha aceptado correctamente.",
            reviewRejectedTitle: "Proforma rechazada.",
            reviewRejectedText: "La proforma se ha rechazado correctamente.",
            editTitle: "Proforma editada.",
            editText: "La proforma se ha editado correctamente.",
            acceptAndSendToAuthTitle: "Proforma aceptada y enviada a autorizar.",
            acceptAndSendToAuthText: "La proforma se ha aceptado y enviada a autorizar correctamente.",
            authorizedTitle: "Proforma autorizada.",
            authorizedText: "La proforma se ha autorizado correctamente.",
            rejectedTitle: "Proforma rechazada.",
            rejectedText: "La proforma se ha rechazado correctamente."
        },
        animationError: {
            uploadTitle: "Error al cargar la proforma.",
            uploadText: "Ocurrió un error al cargar la proforma, vuelve a intentarlo más tarde.",
            reviewAcceptedTitle: "Error al aceptar la proforma.",
            reviewAcceptedText: "Ocurrió un error al aceptar la proforma, vuelve a intentarlo más tarde.",
            reviewRejectedTitle: "Error al rechazar la proforma.",
            reviewRejectedText: "Ocurrió un error al rechazar la proforma, vuelve a intentarlo más tarde.",
            editTitle: "Error al editar la proforma.",
            editText: "Ocurrió un error al editar la proforma, vuelve a intentarlo más tarde.",
            sendToAuthTitle: "Error al enviar a autorización la proforma.",
            sendToAuthText: "Ocurrió un error al enviar la proforma a autorizar.",
            authorizedTitle: "Error al autorizar la proforma.",
            authorizedText: "Ocurrió un error al autorizar la proforma.",
            rejectedTitle: "Error al rechazar la proforma.",
            rejectedText: "Ocurrió un error al rechazar la proforma."
        },
        uploadInstructions: {
            header: "Para cargar una proforma, sigue estos pasos:",
            step1: "Presiona el botón Cargar proforma para abrir el diálogo para cargar la proforma.",
            step2: "Selecciona empresa y proveedor para obtener la lista de facturas a seleccionar.",
            step3: "Selecciona las facturas de la proforma.",
            step4: "Si seleccionas más de una factura, debes seleccionar el área al cual es dirigida la proforma y el monto de cada factura asociada a la proforma.",
            step5: "Selecciona el XML de la proforma para su validación, en cuanto selecciones el XML de la proforma este se validará automáticamente.",
            step6: "Una vez validado y que no se encuentren errores se deben cargar los demás archivos de la proforma como son el PDF, el nombre del PDF de la proforma debe ser el mismo que el del XML.",
            step7: "Ya que se tengan todos los archivos seleccionados, presiona el botón Cargar para cargar la proforma.",
        },
        uploadInstructionsPartner: {
            header: "Para cargar una proforma, sigue estos pasos:",
            step1: "Presiona el botón Cargar proforma para abrir el diálogo para cargar la proforma.",
            step2: "Selecciona empresa para obtener la lista de facturas a seleccionar.",
            step3: "Selecciona las facturas de la proforma.",
            step4: "Si seleccionas más de una factura, debes seleccionar el área al cual es dirigida la proforma y el monto de cada factura asociada a la proforma.",
            step5: "Selecciona el XML de la proforma para su validación, en cuanto selecciones el XML de la proforma este se validará automáticamente.",
            step6: "Una vez validado y que no se encuentren errores se deben cargar los demás archivos de la proforma como son el PDF, el nombre del PDF de la proforma debe ser el mismo que el del XML.",
            step7: "Ya que se tengan todos los archivos seleccionados, presiona el botón Cargar para cargar la proforma.",
        },
        reviewInstructions: {
            header: "Para revisar una proforma, sigue estos pasos:",
            step1: "Haz doble clic sobre el renglón de la proforma a revisar, se abrirá el diálogo con la información de la proforma para revisar.",
            step2: "En la parte inferior del diálogo se encuentra un botón Mostrar archivos, presiona este botón para ver los archivos de la proforma.",
            step3: "Para aceptar la proforma solo presiona el botón Aceptar.",
            step4: "Para rechazar la proforma debes ingresar un comentario con el motivo del rechazo, luego presiona el botón Rechazar."
        },
        editInstructions: {
            header: "Para editar una proforma, sigue estos pasos:",
            step1: "Haz doble clic sobre el renglón correspondiente a la proforma a editar, se abrirá el diálogo para editar los archivos de la proforma.",
            step2: "En la parte inferior del diálogo se encuentra la lista de archivos cargados en la proforma, esta lista se compone por una casilla de verificación seguido del nombre del archivo.",
            step3: "Para conservar un archivo deja marcado la casilla de verificación, para eliminarlo desmarca la casilla de verificación.",
            step4: "Para cargar nuevos archivos en la sección Archivos, presiona el botón Seleccionar para cargar nuevos archivos.",
            step5: "Una vez seleccionados los archivos deseados, presiona el botón Guardar para pasar la proforma de rechazada a cargada.",
        },
        deleteInstructions: {
            header: "Para eliminar una proforma, sigue estos pasos:",
            step1: "Identifica el renglón de la proforma que deseas eliminar.",
            step2: "En la parte derecha final del renglón de la proforma se encuentra el botón Eliminar.",
            step3: "Al presionar el botón Eliminar se abre un diálogo de confirmación.",
            step4: "Revisamos que el folio corresponda con la proforma a eliminar y confirmamos presionando el botón Sí.",
        },
        viewInstructions: {
            header: "Para ver una proforma, sigue estos pasos:",
            step1: "Identifica el renglón de la proforma que deseas ver.",
            step2: "Haz doble clic sobre el renglón de la proforma correspondiente, se abrirá un diálogo con la información de la proforma.",
        },
    }
}

export default prepay