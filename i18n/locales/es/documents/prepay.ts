const prepay = {
    titleAll: "Todas las proformas",
    titleAllTooltip: "Pantalla para consultar todas las proformas.",
    titleUpload: "Cargar y revisar proformas",
    titleUploadTooltip: "Pantalla para cargar nuevas proformas y revisar las pendientes.",
    titleUploadProvider: "Cargar proformas",
    titleUploadTooltipProvider: "Pantalla para cargar nuevas proformas.",
    titleAccepted: "Proformas revisadas",
    titleAcceptedTooltip: "Pantalla para consultar las proformas aceptadas en la revisión.",
    titleRejected: "Proformas rechazadas en la revisión",
    titleRejectedTooltip: "Pantalla para consultar las proformas rechazadas en la revisión.",
    titleAuthPrepay: "Autorizaciones de proformas pendientes para mí",
    titleAuthorizedPrepay: "Proformas autorizadas",
    titleAuthorizedPrepayTooltip: "Pantalla para consultar las proformas autorizadas.",
    titleInProcessPrepay: "Proformas en autorización",
    titleInProcessPrepayTooltip: "Pantalla para consultar las proformas en proceso de autorización.",
    titleAuthRejectedPrepay: "Proformas rechazadas en la autorización",
    titleAuthRejectedPrepayTooltip: "Pantalla para consultar las proformas rechazadas durante la autorización.",
    textBtnCreate: "Cargar proforma",
    
    viewInstructions: {
        uploadPrepay: {
            header: "Cargar una nueva proforma:",
            step1: "Presione el botón 'Cargar proforma'.",
            step2: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para cargar la proforma."
        },
        deleteRejectedInstructions: {
            header: "Volver a cargar una proforma rechazada:",
            step1: "Diríjase a la vista de 'Rechazadas' (En la pestaña de 'Recepción de proformas' si fue rechazada en la revisión o 'Monitorear autorizaciones' si fue rechazada en la autorización).",
            step2: "Localice en la tabla la proforma rechazada que desea volver a cargar.",
            step3: "Ubique la columna 'Eliminar' y haga clic en el botón rojo de 'Eliminar' correspondiente al renglón de su proforma.",
            step4: "Confirme la eliminación en la ventana que aparecerá en pantalla.",
            footer: `Una vez eliminado el registro, podrá iniciar el proceso para cargar su proforma.
             Estas mismas instrucciones están disponibles en la vista 'Rechazadas'.`,
        },
        reviewPrepay: {
            header: "Revisar una proforma:",
            step1: "Haga doble clic en la fila de la proforma que desea revisar.",
            step2: "Se abrirá un cuadro de diálogo con la información y las opciones disponibles para revisar la proforma."
        },
        searchPrepay: {
            header: "Buscar proformas:",
            step1: "Utilice el campo 'Buscar' para localizar proformas por la información disponible en la tabla.",
            step2: "Escriba el texto que desea buscar. La tabla se actualizará automáticamente para mostrar las proformas que coincidan con la búsqueda.",
            step3: "Presione el botón 'Limpiar filtros' para borrar el texto ingresado en el campo 'Buscar'."
        },
        sortColumn: {
            header: "Ordenar por columna:",
            step1: "Haga clic en el encabezado de una columna para ordenar las proformas de forma ascendente o descendente.",
            step2: "El ícono de flecha junto al encabezado de la columna indica el orden aplicado.",
            step3: "Para ordenar por varias columnas, mantenga presionada la tecla 'Ctrl' mientras selecciona los encabezados de las columnas que desea ordenar."
        },
        reloadView: {
            header: "Actualizar vista:",
            step1: "Presione el botón 'Recargar' para actualizar la vista y consultar la información más reciente."
        },
        authPrepay: {
            header: "Autorizar una proforma:",
            step1: "Haga doble clic en la fila de la proforma que desea autorizar.",
            step2: "Se abrirá un cuadro de diálogo con la información y las opciones disponibles para autorizar la proforma."
        },
        authPrepayInMonitor: {
            header: "Autorizar una proforma:",
            step1: "Diríjase a la vista de 'Pendientes para mí' en la pestaña de 'Autorizar proformas'.",
            step2: "Haga doble clic en la fila de la proforma que desea autorizar.",
            step3: "Se abrirá un cuadro de diálogo con la información y las opciones disponibles para autorizar la proforma.",
            footer: "Estas mismas instrucciones están disponibles en la vista 'Pendientes para mí'."
        },
        editPrepay: {
            header: "Modificar una proforma:",
            step1: "Haga doble clic en la fila de la proforma que desea modificar.",
            step2: "Se abrirá un cuadro de diálogo con las opciones disponibles para modificar la proforma."
        },
        downloadFiles: {
            header: "Descargar archivos de una proforma:",
            step1: "Presione el botón de descarga en la columna 'Archivos' de la proforma que desea descargar.",
            step2: "Se descargará un archivo ZIP con los archivos asociados a la proforma, como el PDF y el XML cuando estén disponibles."
        },
        deletePrepay: {
            header: "Eliminar una proforma:",
            step1: "Localice en la tabla la proforma que desea eliminar.",
            step2: "Ubique el botón 'Eliminar' en la parte derecha de la fila correspondiente.",
            step3: "Se abrirá un diálogo de confirmación.",
            step4: "Verifique que el folio corresponda a la proforma que desea eliminar y confirme la acción presionando el botón 'Sí'."
        }
    },
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
            accounting_type: "Tipo",
            authz_authorization_name: "Autorización",
            files: "Archivos"
        }
    },
    confirmations: {
        sendToAuthorization: {
            message: "¿Quieres enviar a autorizar: {{folio}}?",
            header: "Confirma envío de autorización"
        },
        deleteRejected: {
            message: "¿Quieres eliminar esta proforma: {{folio}}?",
            header: "Confirma eliminación"
        }
    },
    dialog: {
        uploadTitle: "Proforma",
        viewTitle: "Proforma",
        editTitle: "Modificar proforma",
        acceptedTitle: "Proforma",
        rejectedTitle: "Proforma",
        howToUpload: "¿Cómo cargar una proforma?",
        howToReview: "¿Cómo revisar una proforma?",
        howToAuthorize: "¿Cómo autorizar una proforma?",
        howToEdit: "¿Cómo modificar una proforma?",
        selectProviderForHelp: "Por favor, seleccione un proveedor en el formulario para poder visualizar las instrucciones correctas de carga.",
        
        fields: {
            company: {
                label: "Empresa: *",
                placeholder: "Empresa",
                tooltip: "Empresa a la que pertenece la proforma.",
                errorMessage: "Seleccione una empresa"
            },
            partner: {
                label: "Proveedor: *",
                placeholder: "Proveedor",
                tooltip: "Proveedor asociado a la proforma.",
                errorMessage: "Seleccione un proveedor"
            },
            areas: {
                label: "Área: *",
                placeholder: "Área",
                tooltip: "Área funcional asociada a la proforma.",
                helperText: "Área",
                placeholderEmpty: "Sin área",
                helperTextEmpty: "Sin área",
                errorKey: "areas",
                errorMessage: "Seleccione un área"
            },
            lInvoices: {
                label: "Facturas:",
                placeholder: "Facturas",
                tooltip: "Facturas asociadas a la proforma."
            },
            lAreas: {
                label: "Área:",
                placeholder: "Área",
                tooltip: "Área funcional asociada a la proforma."
            },
            description: {
                label: "Descripción de la proforma:",
                placeholder: "Ingrese una breve descripción",
                tooltip: "Detalle o motivo por el cual se genera esta proforma.",
                errorMessage: "Ingrese la descripción de la proforma."
            },
            dataPrepeyment: {
                title: "Datos de la proforma",
                folio: {
                    label: "Folio: *",
                    placeholder: "Folio (Identificador del pago)",
                    tooltip: "Folio que identifica la proforma.",
                    errorMessage: "Ingrese el folio de la proforma."
                },
                date: {
                    label: "Fecha: *",
                    placeholder: "Fecha",
                    tooltip: "Fecha de emisión de la proforma.",
                    errorMessage: "Ingrese la fecha de la proforma."
                },
                amount: {
                    label: "Monto: *",
                    placeholder: "Monto",
                    tooltip: "Monto de la proforma.",
                    errorMessage: "Ingrese el monto de la proforma."
                },
                currency: {
                    label: "Moneda: *",
                    placeholder: "Moneda",
                    tooltip: "Moneda (divisa) en la que se expresa el monto de la proforma.",
                    errorMessage: "Seleccione la moneda de la proforma."
                }
            },
            dataReference: {
                title: "Datos de la referencia",
                date: {
                    label: "Fecha:",
                    placeholder: "Fecha",
                    tooltip: "Fecha de emisión de la referencia."
                },
                folio: {
                    label: "Folio:",
                    placeholder: "Folio (Identificador de la referencia)",
                    tooltip: "Folio que identifica la referencia."
                },
                amount: {
                    label: "Monto:",
                    placeholder: "Monto",
                    tooltip: "Monto de la referencia."
                },
                currency: {
                    label: "Moneda:",
                    placeholder: "Moneda",
                    tooltip: "Moneda (divisa) en la que se expresa el monto de la referencia."
                }
            },
            dataPayment: {
                title: "Datos del pago",
                proportionOption: {
                    label: "Proporción de pago:",
                    placeholder: "Seleccione la proporción de pago",
                    helperText: "Por favor seleccione una opción.",
                    tooltip: "Seleccione si desea pagar la totalidad o una parte proporcional.",
                },
                percentOption: {
                    label: "% de pago:",
                    placeholder: "Porcentaje",
                    helperText: "Por favor seleccione una opción.",
                    tooltip: "Porcentaje exacto que se cubrirá en el pago.",
                    errorMessage: "Ingrese el % de pago."
                },
                amountOption: {
                    label: "Monto de pago:",
                    placeholder: "Monto a pagar",
                    helperText: "Por favor ingrese el monto de pago.",
                    tooltip: "Cantidad específica asignada para este pago.",
                },
                is_payment_loc: {
                    label: "Pagar en pesos mexicanos",
                    tooltip: "Indica si el pago de esta proforma debe realizarse en pesos mexicanos."
                },
                modifyPaymentDate: {
                    label: "Modificar fecha pago",
                    tooltip: "Habilita la edición manual de la fecha programada para el pago."
                },
                paymentDate: {
                    label: "Fecha de pago:",
                    placeholder: "Elija la fecha de pago",
                    tooltip: "Fecha programada en la que se realizará el pago.",
                    errorMessage: "Seleccione una fecha válida."
                },
                isUrgent: {
                    label: "¿Proforma urgente?",
                    tooltip: "Marca esta proforma con prioridad alta para agilizar su procesamiento."
                },
                paymentInstructions: {
                    label: "Instrucciones de pago:",
                    placeholder: "Ingrese instrucciones adicionales de pago...",
                    tooltip: "Instrucciones de pago proporcionadas para el cliente.",
                    errorMessage: "Ingrese las instrucciones de pago."
                }
            },
            uuid: {
                label: "UUID:",
                placeholder: "UUID",
                tooltip: "Identificador único del comprobante fiscal."
            },
            files: {
                label: "Archivos:",
                placeholder: "Archivos",
                tooltip: "Archivos asociados a la proforma."
            },
            partner_fiscal_id: {
                label: "RFC del emisor:",
                placeholder: "RFC del emisor",
                tooltip: "RFC del emisor de la proforma."
            },
            company_fiscal_id: {
                label: "RFC del receptor:",
                placeholder: "RFC del receptor",
                tooltip: "RFC del receptor de la proforma."
            },
            receiver_tax_regime: {
                label: "Régimen fiscal del receptor:",
                placeholder: "Régimen fiscal del receptor",
                tooltip: "Régimen fiscal correspondiente al receptor de la proforma."
            },
            issuer_tax_regime: {
                label: "Régimen fiscal del emisor:",
                placeholder: "Régimen fiscal del emisor",
                tooltip: "Régimen fiscal correspondiente al emisor de la proforma."
            },
            exchange_rate: {
                label: "Tipo de cambio:",
                placeholder: "Tipo de cambio",
                tooltip: "Tipo de cambio aplicado a la proforma."
            },
            authz_acceptance_notes: {
                label: "Comentarios de aceptación/rechazo:",
                placeholder: "Ingrese los comentarios de aceptación o rechazo",
                tooltip: "Comentarios registrados durante la revisión de la proforma.",
                errorMessage: "Ingrese los comentarios de rechazo."
            },
            authz_authorization_notes: {
                label: "Comentarios de autorización/rechazo:",
                placeholder: "Ingrese los comentarios de autorización o rechazo",
                tooltip: "Comentarios registrados durante la autorización de la proforma.",
                errorMessage: "Ingrese los comentarios de rechazo."
            },
            reference: {
                label: "Referencia: *",
                placeholder: "Referencia",
                tooltip: "Referencia asociada a la proforma.",
                helperText: "Seleccione la referencia de la proforma.",
                placeholderEmpty: "Sin referencia",
                withOutReferenceOption: "Sin referencia"
            }
        },
        files: {
            label: "Archivos de la proforma: *",
            placeholderMultiple: "Suelte los archivos aquí para comenzar a cargarlos",
            placeholderSingle: "Suelte el archivo aquí para comenzar a cargarlo",
            helperTextFiles: "Seleccione los archivos de la proforma.",
            helperTextPdf: "Debe cargar la representación impresa en PDF de la proforma.",
            helperTextXml: "Debe cargar un archivo XML.",
            tooltip: "Archivos asociados a la proforma.",
            invalidFileSize: "El tamaño máximo por archivo es de 5 MB.",
            invalidFileSizeMessageSummary: "Archivo demasiado grande.",
            invalidFileType: "Solo se permiten archivos \"{{extensions}}\".",
            invalidAllFilesSize: "El tamaño máximo de los archivos es de 25 MB.",
            hasSameFile: "No es necesario volver a cargar el archivo {{xmlName}} en la sección 'Archivos'.",
            hasMatchingPDF: "Es necesario cargar la representación impresa en PDF de la proforma y que tenga el mismo nombre que el archivo XML {{xmlBaseName}}."
        },
        errors: {
            uploadError: "Error al cargar la proforma. Verifique los archivos y la referencia e intente nuevamente.",
            getReferencesError: "Error al obtener las referencias. Intente nuevamente más tarde.",
            updateStatusError: "Error al actualizar el estado de la proforma. Intente nuevamente más tarde.",
            uploadValidXmlError: "Error al enviar el XML para su validación.",
            getCurrenciesError: "Error al obtener los tipos de cambio.",
            getLInvoicesToReview: "Error al obtener la lista de facturas."
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
            acceptAndSendToAuthTitle: "Proforma aceptada y enviada a autorización.",
            acceptAndSendToAuthText: "La proforma se ha aceptado y enviado a autorización correctamente.",
            authorizedTitle: "Proforma autorizada.",
            authorizedText: "La proforma se ha autorizado correctamente.",
            rejectedTitle: "Proforma rechazada.",
            rejectedText: "La proforma se ha rechazado correctamente."
        },
        animationError: {
            uploadTitle: "Error al cargar la proforma.",
            uploadText: "Ocurrió un error al cargar la proforma. Intente nuevamente más tarde.",
            reviewAcceptedTitle: "Error al aceptar la proforma.",
            reviewAcceptedText: "Ocurrió un error al aceptar la proforma. Intente nuevamente más tarde.",
            reviewRejectedTitle: "Error al rechazar la proforma.",
            reviewRejectedText: "Ocurrió un error al rechazar la proforma. Intente nuevamente más tarde.",
            editTitle: "Error al modificar la proforma.",
            editText: "Ocurrió un error al modificar la proforma. Intente nuevamente más tarde.",
            sendToAuthTitle: "Error al enviar la proforma a autorización.",
            sendToAuthText: "Ocurrió un error al enviar la proforma a autorización.",
            authorizedTitle: "Error al autorizar la proforma.",
            authorizedText: "Ocurrió un error al autorizar la proforma.",
            rejectedTitle: "Error al rechazar la proforma.",
            rejectedText: "Ocurrió un error al rechazar la proforma."
        },
        uploadInstructions: {
            header: "Cargar una proforma:",
            step1: "Seleccione la empresa y el proveedor para obtener la lista de órdenes de compra disponibles.",
            step2: "Seleccione la orden de compra asociada a la proforma o la opción 'Sin referencia' en caso de no requerirla.",
            step3: "Complete los campos de los datos de la proforma. Los campos con (*) son obligatorios.",
            step4: "Cargue los archivos de la proforma, como el PDF.",
            step5: "Una vez seleccionados todos los archivos necesarios, presione el botón 'Cargar' para registrar la proforma."
        },
        uploadInstructionsPartner: {
            header: "Cargar una proforma:",
            step1: "Seleccione la empresa para obtener la lista de órdenes de compra disponibles.",
            step2: "Seleccione la orden de compra asociada a la proforma.",
            step3: "Complete los campos de los datos de la proforma. Los campos con (*) son obligatorios.",
            step4: "Cargue los archivos de la proforma, como el PDF.",
            step5: "Una vez seleccionados todos los archivos necesarios, presione el botón 'Cargar' para registrar la proforma."
        },
        reviewInstructions: {
            header: "Para revisar una proforma, siga estos pasos:",
            step1: "Haga doble clic sobre el renglón de la proforma que desea revisar. Se abrirá el diálogo con la información de la proforma.",
            step2: "En la parte inferior del diálogo, presione el botón 'Mostrar archivos' para consultar los archivos de la proforma.",
            step3: "Si la proforma es correcta, presione el botón 'Aceptar'.",
            step4: "Si la proforma es incorrecta, ingrese un comentario con el motivo del rechazo y presione el botón 'Rechazar'."
        },
        editInstructions: {
            header: "Modificar una proforma:",
            step1: "Haga doble clic sobre el renglón correspondiente a la proforma que desea modificar. Se abrirá el diálogo para modificar sus archivos.",
            step2: "En la parte inferior del diálogo se encuentra la lista de archivos cargados en la proforma. Cada archivo tiene una casilla de verificación seguida de su nombre.",
            step3: "Para conservar un archivo, deje marcada la casilla de verificación. Para eliminarlo, desmarque la casilla.",
            step4: "Para cargar nuevos archivos en la sección 'Archivos', presione el botón 'Seleccionar'.",
            step5: "Una vez seleccionados los archivos deseados, presione el botón 'Guardar' para cambiar el estado de la proforma de rechazada a cargada."
        },
        deleteInstructions: {
            header: "Para eliminar una proforma, siga estos pasos:",
            step1: "Identifique el renglón de la proforma que desea eliminar.",
            step2: "En la parte derecha del renglón de la proforma se encuentra el botón 'Eliminar'.",
            step3: "Al presionar el botón 'Eliminar' se abrirá un diálogo de confirmación.",
            step4: "Verifique que el folio corresponda a la proforma que desea eliminar y confirme presionando el botón 'Sí'."
        },
        viewInstructions: {
            header: "Para ver una proforma, siga estos pasos:",
            step1: "Identifique el renglón de la proforma que desea consultar.",
            step2: "Haga doble clic sobre el renglón correspondiente. Se abrirá un diálogo con la información de la proforma."
        }
    }
}
export default prepay