const nc = {
    titleAll: "Todas las NC",
    titleAllTooltip: "Pantalla para consultar todas las notas de crédito registradas en el sistema.",

    titleUpload: "Cargar y revisar NC",
    titleUploadTooltip: "Pantalla para cargar nuevas notas de crédito y revisar las pendientes.",

    titleUploadProvider: "Cargar NC",
    titleUploadProviderTooltip: "Pantalla para cargar nuevas notas de crédito.",

    titleAccepted: "NC revisadas",
    titleAcceptedTooltip: "Pantalla para consultar las notas de crédito aceptadas en la revisión.",

    titleRejected: "NC rechazadas en la revisión",
    titleRejectedTooltip: "Pantalla para consultar las notas de crédito rechazadas en la revisión.",

    titleAuthNc: "Autorizaciones de NC pendientes para mí",
    titleAuthNcTooltip: "Pantalla para consultar las notas de crédito pendientes de mi autorización.",

    titleAuthorizedNc: "NC autorizadas",
    titleAuthorizedNcTooltip: "Pantalla para consultar las notas de crédito autorizadas.",

    titleInProcessNc: "NC en autorización",
    titleInProcessNcTooltip: "Pantalla para consultar las notas de crédito en proceso de autorización.",

    titleRejectedNc: "NC rechazadas en la autorización",
    titleRejectedNcTooltip: "Pantalla para consultar las notas de crédito rechazadas en la autorización.",

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

    // --- INSTRUCCIONES DE LA VISTA PRINCIPAL ---
    viewInstructions: {
        uploadNc: {
            header: "Cargar una nueva nota de crédito:",
            step1: "Presione el botón 'Cargar NC'.",
            step2: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para cargar la nota de crédito."
        },
        deleteRejectedInstructions: {
            header: "Volver a cargar una nota de crédito rechazada:",
            step1: "Diríjase a la vista de 'Rechazadas' (En la pestaña de 'Recepción de NC' si fue rechazada en la revisión o 'Monitorear autorizaciones' si fue rechazada en la autorización).",
            step2: "Localice en la tabla la nota de crédito rechazada que desea volver a cargar.",
            step3: "Si la nota de crédito fue rechazada en la revisión, tiene la opción de modificarla y automaticamente se enviará a revisión nuevamente.",
            step4: "En caso de quererla eliminar, continue con los siguientes pasos.",
            step5: "Ubique la columna 'Eliminar' y haga clic en el botón rojo de 'Eliminar' correspondiente al renglón de su nota de crédito.",
            step6: "Confirme la eliminación en la ventana que aparecerá en pantalla.",
            footer: `Una vez eliminado el registro, podrá iniciar el proceso para cargar su nota de crédito.
             Estas mismas instrucciones están disponibles en la vista 'Rechazadas'.`,
        },
        reviewNc: {
            header: "Revisar una nota de crédito:",
            step1: "Haga doble clic en la fila de la nota de crédito que desea revisar.",
            step2: "Se abrirá un cuadro de diálogo con la información y las opciones disponibles para revisar la nota de crédito."
        },
        searchNc: {
            header: "Buscar notas de crédito:",
            step1: "Utilice el campo 'Buscar' para localizar notas de crédito por la información disponible en la tabla.",
            step2: "Escriba el texto que desea buscar. La tabla se actualizará automáticamente para mostrar las notas de crédito que coincidan con la búsqueda.",
            step3: "Presione el botón 'Limpiar filtros' para borrar el texto ingresado en el campo 'Buscar'."
        },
        sortColumn: {
            header: "Ordenar por columna:",
            step1: "Haga clic en el encabezado de una columna para ordenar las notas de crédito de forma ascendente o descendente.",
            step2: "El ícono de flecha junto al encabezado de la columna indica el orden aplicado."
        },
        reloadView: {
            header: "Actualizar vista:",
            step1: "Presione el botón 'Recargar' para actualizar la vista y consultar la información más reciente."
        },
        authNc: {
            header: "Autorizar una nota de crédito:",
            step1: "Haga doble clic en la fila de la nota de crédito que desea autorizar.",
            step2: "Se abrirá un cuadro de diálogo con la información y las opciones disponibles para autorizar la nota de crédito."
        },
        authNcInMonitor: {
            header: "Autorizar una nota de crédito:",
            step1: "Diríjase a la vista de 'Pendientes para mí' en la pestaña de 'Autorizar NC'.",
            step2: "Haga doble clic en la fila de la proforma que desea autorizar.",
            step3: "Se abrirá un cuadro de diálogo con la información y las opciones disponibles para autorizar la nota de crédito.",
            footer: "Estas mismas instrucciones están disponibles en la vista 'Pendientes para mí'."
        },
        editNc: {
            header: "Modificar una nota de crédito:",
            step1: "Haga doble clic en la fila de la nota de crédito que desea modificar.",
            step2: "Se abrirá un cuadro de diálogo con las opciones disponibles para modificar la nota de crédito."
        },
        downloadFiles: {
            header: "Descargar archivos de una nota de crédito:",
            step1: "Presione el botón de descarga en la columna 'Archivos' de la nota de crédito que desea descargar.",
            step2: "Se descargará un archivo ZIP con los archivos asociados a la nota de crédito, como el PDF y el XML cuando estén disponibles."
        },
        deleteNc: {
            header: "Eliminar una nota de crédito:",
            step1: "Localice en la tabla la nota de crédito que desea eliminar.",
            step2: "Ubique el botón 'Eliminar' en la parte derecha de la fila correspondiente.",
            step3: "Se abrirá un diálogo de confirmación.",
            step4: "Verifique que el folio corresponda a la nota de crédito que desea eliminar y confirme la acción presionando el botón 'Sí'."
        }
    },

    confirmations: {
        sendToAuthorization: {
            message: "¿Quieres enviar a autorizar: {{folio}}?",
            header: "Confirma envío de autorización"
        },
        deleteRejected: {
            message: "¿Quieres eliminar esta nota de crédito: {{folio}}?",
            header: "Confirma eliminación"
        }
    },

    // --- INSTRUCCIONES Y TEXTOS DEL DIÁLOGO ---
    dialog: {
        uploadTitle: "Carga de NC",
        viewTitle: "Nota de crédito",
        editTitle: "Modificar NC",
        acceptedTitle: "NC",
        rejectedTitle: "NC",
        howToUpload: "¿Cómo cargar una nota de crédito?",
        howToReview: "¿Cómo revisar una nota de crédito?",
        howToAuthorize: "¿Cómo autorizar una nota de crédito?",
        howToEdit: "¿Cómo modificar una nota de crédito?",
        selectProviderForHelp: "Por favor, seleccione un proveedor en el formulario para poder visualizar las instrucciones correctas de carga.",
        noReference: "Sin referencia",
        noReferenceWarning: "No se pueden registrar notas de crédito sin una factura de referencia.",

        foreignWarning: {
            title: "Aviso para proveedores extranjeros",
            descriptionPart1: "Por favor, asegúrese de cargar",
            descriptionHighlight: "primero",
            descriptionPart2: "el PDF principal de su",
            documentName: "Nota de Crédito",
            descriptionPart3: ".",
            footerPart1: "El documento que quede",
            footerHighlight: "en la parte superior",
            footerPart2: "de la lista será registrado como el oficial y los demás se guardarán como anexos."
        },

        sections: {
            invoices: "Facturas de la nota de crédito",
            data: "Datos de la nota de crédito",
            reviewComments: "Comentarios de la revisión",
            authComments: "Comentarios de la autorización"
        },

        invoiceItems: {
            folioLabel: "Folio:",
            appliedAmountLabel: "| Monto aplicado:",
            amountZeroError: "La cantidad no puede ser 0"
        },

        fields: {
            company: {
                label: "Empresa: *",
                placeholder: "Seleccione la empresa",
                tooltip: "Empresa receptora de la nota de crédito.",
                errorMessage: "Selecciona empresa"
            },

            partner: {
                label: "Proveedor: *",
                placeholder: "Seleccione un proveedor",
                tooltip: "Proveedor que emitió la nota de crédito.",
                errorMessage: "Selecciona proveedor"
            },

            lInvoices: {
                label: "Facturas: *",
                placeholder: "Seleccione las facturas",
                tooltip: "Facturas asociadas a la nota de crédito.",
                errorMessage: "Selecciona facturas"
            },

            application_type: {
                label: "Tipo de aplicación: *",
                placeholder: "Seleccione el tipo de aplicación",
                tooltip: "Tipo de aplicación contable de la nota de crédito.",
                errorMessage: "Selecciona un tipo de aplicacion"
            },

            lAreas: {
                label: "Área: *",
                placeholder: "Seleccione el área",
                tooltip: "Área funcional asociada a la nota de crédito.",
                errorMessage: "Selecciona un área"
            },

            date: {
                label: "Fecha:",
                placeholder: "Fecha",
                tooltip: "Fecha de emisión de la nota de crédito.",
                errorMessage: "Selecciona fecha"
            },

            folio: {
                label: "Folio:",
                placeholder: "Folio",
                tooltip: "Folio de la nota de crédito.",
                errorMessage: "Ingresa folio"
            },

            uuid: {
                label: "UUID:",
                placeholder: "UUID",
                tooltip: "Identificador único del comprobante fiscal."
            },

            partner_fiscal_id: {
                label: "RFC del emisor:",
                placeholder: "RFC del emisor",
                tooltip: "RFC del emisor de la nota de crédito.",
                errorMessage: "Ingresa RFC emisor"
            },

            company_fiscal_id: {
                label: "RFC del receptor:",
                placeholder: "RFC del receptor",
                tooltip: "RFC del receptor de la nota de crédito.",
                errorMessage: "Ingresa RFC receptor"
            },

            receiver_tax_regime: {
                label: "Régimen fiscal del receptor:",
                placeholder: "Régimen fiscal del receptor",
                tooltip: "Régimen fiscal del receptor de la nota de crédito."
            },

            issuer_tax_regime: {
                label: "Régimen fiscal del emisor:",
                placeholder: "Régimen fiscal del emisor",
                tooltip: "Régimen fiscal del emisor de la nota de crédito.",
                errorMessage: "Ingresa régimen fiscal del emisor"
            },

            amount: {
                label: "Monto:",
                placeholder: "Monto",
                tooltip: "Monto total de la nota de crédito.",
                errorMessage: "Ingresa monto"
            },

            currency: {
                label: "Moneda:",
                placeholder: "Moneda",
                tooltip: "Moneda en la que se expresa el monto de la nota de crédito.",
                errorMessage: "Selecciona moneda"
            },

            exchange_rate: {
                label: "Tipo de cambio:",
                placeholder: "Tipo de cambio",
                tooltip: "Tipo de cambio aplicado a la nota de crédito.",
                errorMessage: "Ingresa tipo de cambio"
            },

            authz_acceptance_notes: {
                label: "Comentarios de aceptación/rechazo:",
                placeholder: "Ingrese los comentarios de aceptación o rechazo",
                tooltip: "Comentarios registrados durante la revisión de la nota de crédito.",
                errorMessage: "Ingrese comentario para rechazar"
            },

            authz_authorization_notes: {
                label: "Comentarios de autorización/rechazo:",
                placeholder: "Ingrese los comentarios de autorización o rechazo",
                tooltip: "Comentarios registrados durante la autorización de la nota de crédito.",
                errorMessage: "Ingrese comentario para rechazar"
            },
        },

        files: {
            xmlLabel: "Archivo XML de la nota de crédito: *",
            label: "Archivos de la nota de crédito: *",
            tooltip: "Archivos asociados a la nota de crédito.",
            placeholderMultiple: "Suelte aquí los archivos para comenzar a cargarlos",
            placeholderSingle: "Suelte el archivo aquí para comenzar a cargarlo",
            helperTextFiles: "Seleccione los archivos asociados a la nota de crédito.",
            helperTextPdf: "Debe cargar la representación impresa en PDF de la nota de crédito.",
            helperTextXml: "Debe cargar un archivo XML.",
            invalidFileSize: "El tamaño máximo por archivo es de 5 MB.",
            invalidFileSizeMessageSummary: "Archivo demasiado grande.",
            invalidFileType: "Solo se permiten archivos \"{{extensions}}\".",
            invalidAllFilesSize: "El tamaño máximo de los archivos es de 25 MB.",
            hasSameFile: "No es necesario volver a cargar el archivo {{xmlName}} en la sección de archivos.",
            hasMatchingPDF: "Es necesario cargar la representación impresa en PDF de la nota de crédito y que tenga el mismo nombre que el archivo XML {{xmlBaseName}}."
        },

        errors: {
            uploadError: "Error al cargar la nota de crédito. Verifique los archivos y la referencia, y vuelva a intentarlo.",
            getReferencesError: "Error al obtener las referencias. Por favor, intente nuevamente más tarde.",
            updateStatusError: "Error al actualizar el estado de la nota de crédito. Por favor, intente nuevamente más tarde.",
            uploadValidXmlError: "Error al enviar el XML para su validación.",
            getCurrenciesError: "Error al obtener los tipos de cambio.",
            getLInvoicesToReview: "Error al obtener la lista de facturas."
        },

        animationSuccess: {
            uploadTitle: "Nota de crédito cargada.",
            uploadText: "La nota de crédito se ha cargado correctamente.",
            reviewAcceptedTitle: "Nota de crédito aceptada.",
            reviewAcceptedText: "La nota de crédito se ha aceptado correctamente.",
            reviewRejectedTitle: "Nota de crédito rechazada.",
            reviewRejectedText: "La nota de crédito se ha rechazado correctamente.",
            editTitle: "Nota de crédito modificada.",
            editText: "La nota de crédito se ha modificado correctamente.",
            acceptAndSendToAuthTitle: "Nota de crédito aceptada y enviada a autorización.",
            acceptAndSendToAuthText: "La nota de crédito se ha aceptado y enviado a autorización correctamente.",
            authorizedTitle: "Nota de crédito autorizada.",
            authorizedText: "La nota de crédito se ha autorizado correctamente.",
            rejectedTitle: "Nota de crédito rechazada.",
            rejectedText: "La nota de crédito se ha rechazado correctamente."
        },

        animationError: {
            uploadTitle: "Error al cargar la nota de crédito.",
            uploadText: "Ocurrió un error al cargar la nota de crédito. Vuelva a intentarlo más tarde.",
            reviewAcceptedTitle: "Error al aceptar la nota de crédito.",
            reviewAcceptedText: "Ocurrió un error al aceptar la nota de crédito. Vuelva a intentarlo más tarde.",
            reviewRejectedTitle: "Error al rechazar la nota de crédito.",
            reviewRejectedText: "Ocurrió un error al rechazar la nota de crédito. Vuelva a intentarlo más tarde.",
            editTitle: "Error al modificar la nota de crédito.",
            editText: "Ocurrió un error al modificar la nota de crédito. Vuelva a intentarlo más tarde.",
            sendToAuthTitle: "Error al enviar la nota de crédito a autorización.",
            sendToAuthText: "Ocurrió un error al enviar la nota de crédito a autorización.",
            authorizedTitle: "Error al autorizar la nota de crédito.",
            authorizedText: "Ocurrió un error al autorizar la nota de crédito.",
            rejectedTitle: "Error al rechazar la nota de crédito.",
            rejectedText: "Ocurrió un error al rechazar la nota de crédito."
        },

        uploadInstructions: {
            header: "Cargar una nota de crédito",
            step1: "Seleccione la empresa y el proveedor para obtener la lista de facturas disponibles.",
            step2: "Seleccione una o varias facturas asociadas a la nota de crédito. No es posible cargar una nota de crédito sin facturas asociadas.",
            step3: "Si selecciona más de una factura, asigne el área a la que corresponde la nota de crédito e indique el monto correspondiente a cada factura.",
            step4: "Seleccione el XML de la nota de crédito. El sistema lo validará automáticamente.",
            step5: "Una vez validado el XML y si no se detectan errores, cargue los archivos restantes de la nota de crédito, como el PDF. El nombre del archivo PDF debe coincidir con el nombre del archivo XML.",
            step6: "Una vez seleccionados todos los archivos necesarios, presione el botón 'Cargar' para registrar la nota de crédito."
        },

        uploadInstructionsPartner: {
            header: "Cargar una nota de crédito",
            step1: "Seleccione la empresa para obtener la lista de facturas disponibles.",
            step2: "Seleccione una o varias facturas asociadas a la nota de crédito. No es posible cargar una nota de crédito sin facturas asociadas.",
            step3: "Si selecciona más de una factura, asigne el área a la que corresponde la nota de crédito e indique el monto correspondiente a cada factura.",
            step4: "Seleccione el XML de la nota de crédito. El sistema lo validará automáticamente.",
            step5: "Una vez validado el XML y si no se detectan errores, cargue los archivos restantes de la nota de crédito, como el PDF. El nombre del archivo PDF debe coincidir con el nombre del archivo XML.",
            step6: "Una vez seleccionados todos los archivos necesarios, presione el botón 'Cargar' para registrar la nota de crédito."
        },

        uploadInstructionsForeign: {
            header: "Cargar una nota de crédito foránea",
            step1: "Seleccione la empresa para obtener la lista de facturas disponibles.",
            step2: "Seleccione una o varias facturas asociadas a la nota de crédito. No es posible cargar una nota de crédito sin facturas asociadas.",
            step3: "Si selecciona más de una factura, asigne el área a la que corresponde la nota de crédito e indique el monto correspondiente a cada factura.",
            step4: "En el campo 'Folio', ingrese la serie, si aplica, y el folio de la nota de crédito en formato serie-folio. Si la serie no aplica, ingrese únicamente el folio.",
            step5: "Ingrese el resto de los datos de la nota de crédito. Los campos marcados con un * son obligatorios.",
            step6: "Seleccione los archivos asociados a la nota de crédito en el campo 'Archivos de la nota de crédito'. IMPORTANTE: el primer archivo que cargue debe ser el PDF principal.",
            step7: "Asegúrese de que los archivos no superen los 5 MB cada uno y que en total no superen los 25 MB.",
            step8: "Una vez seleccionados todos los archivos necesarios, presione el botón 'Cargar' para registrar la nota de crédito.",
            footer: "Puede seleccionar varios archivos a la vez, pero asegúrese de que al menos uno sea un PDF. Si selecciona archivos que no cumplen con estos requisitos, se mostrará un mensaje de error."
        },

        reviewInstructions: {
            header: "Revisar una nota de crédito",
            step1: "En la parte inferior del diálogo, presione el botón 'Mostrar archivos' para consultar los archivos de la nota de crédito.",
            step2: "Si la nota de crédito es correcta, presione el botón 'Aceptar'.",
            step3: "Si la nota de crédito es incorrecta, ingrese un comentario en 'Comentarios de aceptación/rechazo' con el motivo del rechazo y presione el botón 'Rechazar'."
        },
        
        authorizationInstructions: {
            header: "Autorizar una nota de crédito",
            step1: "En la parte inferior del diálogo, presione el botón 'Mostrar archivos' para consultar los archivos de la nota de crédito.",
            step2: "Si la nota de crédito es correcta, presione el botón 'Autorizar'.",
            step3: "Si la nota de crédito es incorrecta, ingrese un comentario en 'Comentarios de autorización/rechazo' con el motivo del rechazo y presione el botón 'Rechazar'."
        },

        editInstructions: {
            header: "Modificar una nota de crédito",
            step1: "En la parte inferior del diálogo encontrará la lista de archivos cargados en la nota de crédito. Cada archivo cuenta con una casilla de verificación.",
            step2: "Para conservar un archivo, mantenga marcada su casilla de verificación. Para eliminarlo, desmarque la casilla correspondiente.",
            step3: "Para cargar nuevos archivos, diríjase a la sección 'Archivos' y presione el botón 'Seleccionar'.",
            step4: "Una vez seleccionados los archivos deseados, presione el botón 'Guardar' para cambiar el estado de la nota de crédito de rechazada a cargada."
        }
    }
};

export default nc;