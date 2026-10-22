import payments from "./payments";

const crp = {
    titleAll: "Todos los CRP",
    titleAllTooltip: "Pantalla para consultar todos los CRP, sin importar su estatus actual.",
    titleUpload: "Cargar y revisar CRP",
    titleUploadTooltip: "Pantalla para cargar nuevos CRP y revisar los pendientes.",
    titleUploadprovider: "Cargar CRP",
    titleUploadproviderTooltip: "Pantalla para cargar nuevos CRP.",
    titleAccepted: "CRP revisados",
    titleAcceptedTooltip: "Pantalla para consultar los CRP aceptados en la revisión.",
    titleRejected: "CRP rechazados en la revisión",
    titleRejectedTooltip: "Pantalla para consultar los CRP rechazados en la revisión.",
    titleAllAuth: "CRP en autorización",
    titleAllAuthTooltip: "Pantalla para consultar los CRP aceptados en la revisión y pendientes de autorización.",
    titleAuthorized: "CRP autorizados",
    titleAuthorizedTooltip: "Pantalla para consultar los CRP autorizados.",
    titleRejectedAuth: "CRP rechazados en la autorización",
    titleRejectedAuthTooltip: "Pantalla para consultar los CRP rechazados en la autorización.",
    titleMyAuth: "Autorizaciones de CRP pendientes para mí",
    titleMyAuthTooltip: "Pantalla para consultar los CRP pendientes de mi autorización.",

    textBtnCreate: "Cargar CRP",
    confirmations: {
        sendToAuthorization: {
            message: "¿Quieres enviar a autorizar: {{folio}}?",
            header: "Confirma envío de autorización"
        },
        deleteRejected: {
            message: "¿Quieres eliminar este CRP: {{folio}}?",
            header: "Confirma eliminación"
        },
        
    },
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
    viewInstructions: {
        uploadCrp: {
            header: "Cargar un nuevo comprobante de recepción de pagos (CRP):",
            step1: "Presione el botón 'Cargar CRP'.",
            step2: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para cargar un nuevo CRP.",
        },
        deleteRejectedInstructions: {
            header: "Volver a cargar un CRP rechazado:",
            step1: "Diríjase a la vista de 'Monitorear autorizaciones' y seleccione la opción de 'Rechazados'.",
            step2: "Localice en la tabla el CRP rechazado que desea volver a cargar.",
            step3: "Ubique la columna 'Eliminar' y haga clic en el botón rojo de 'Eliminar' correspondiente al renglón de su CRP.",
            step4: "Confirme la eliminación en la ventana que aparecerá en pantalla.",
            footer: `Una vez eliminado el registro, podrá iniciar el proceso para cargar su CRP.
             Estas mismas instrucciones están disponibles en la vista 'Rechazados'.`,
        },
        searchCrp: {
            header: "Filtrar CRP:",
            step1: "Utilice el campo 'Buscar' para filtrar los CRP por cualquier campo visible en la tabla.",
            step2: "Escriba el texto que desea buscar y la tabla se actualizará automáticamente para mostrar solo los CRP que coincidan con el texto ingresado.",
            step3: "Presione el botón 'Limpiar filtros' para limpiar todos los filtros aplicados y mostrar todos los CRP nuevamente."
        },
        // sortColumn: {
        //     header: "Ordenar por columna:",
        //     step1: "Haz clic en el encabezado de cualquier columna para ordenar las facturas por esa columna en orden ascendente o descendente.",
        //     step2: "El ícono de flecha junto al encabezado de la columna indica el orden actual (ascendente o descendente).",
        //     step3: "Para ordenar por varias columnas, mantén presionado la tecla 'Ctrl' mientras seleccionas los encabezados de las columnas que deseas ordenar.",
        //},
        reloadView: {
            header: "Actualizar vista:",
            step1: "Presione el botón de 'Recargar' para actualizar la vista y cargar los datos más recientes.",
        },
        authCrp: {
            header: "Autorizar un CRP:",
            step1: "Haga doble clic en la fila de el CRP que desea autorizar.",
            step2: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para autorizar el CRP.",
        },
        authCrpInMonitor: {
            header: "Autorizar un CRP:",
            step1: "Diríjase a la vista de 'Pendientes para mí' en la pestaña de 'Autorizar CRP'.",
            step2: "Haga doble clic en la fila de el CRP que desea autorizar.",
            step3: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para autorizar el CRP.",
            footer: "Estas mismas instrucciones están disponibles en la vista 'Pendientes para mí'."
        },
        downloadFiles: {
            header: "Descargar archivos de un CRP:",
            step1: "Presione el botón de descarga en la columna 'Archivos' del CRP que desea descargar.",
            step2: "Se descargará un archivo ZIP que contiene los archivos PDF y XML del CRP.",
        },
        deleteRejectedInstructionsShort: {
            header: "Eliminar CRP rechazado:",
            step1: "Localice en la tabla el CRP rechazado que desea volver a cargar.",
            step2: "Ubique la columna 'Eliminar' y haga clic en el botón rojo de 'Eliminar' correspondiente al renglón de su CRP.",
            step3: "Confirme la eliminación en la ventana que aparecerá en pantalla.",
            footer: `Una vez eliminado el registro, podrá iniciar el proceso para cargar su CRP.`,
        },
    },
    dialog: {
        uploadTitle: "Carga de CRP",
        authHeader: "Autorizar CRP",
        viewTitle: "CRP",
        editTitle: "Modificar CRP",
        acceptedTitle: "CRP",
        rejectedTitle: "CRP",
        howToUpload: "¿Cómo cargar un CRP?",
        howToAuth: "¿Cómo autorizar un CRP?",
        selectProviderForHelp: "Por favor, seleccione un proveedor en el formulario para poder visualizar las instrucciones correctas de carga.",
        crpDataTitle: "Datos del comprobante de recepción de pagos",
        paymentDataTitle: "Datos de los pagos",
        
        fields: {
            company: {
                label: "Empresa: *",
                placeholder: "Seleccione la empresa",
                helperText: "Seleccione la empresa a la que pertenece el comprobante de recepción de pagos.",
                tooltip: "Empresa receptora del comprobante de recepción de pagos.",
            },

            partner: {
                label: "Proveedor: *",
                placeholder: "Seleccione el proveedor",
                helperText: "Seleccione el proveedor al que pertenece el comprobante de recepción de pagos.",
                tooltip: "Proveedor que emitió el comprobante de recepción de pagos.",
            },

            payment: {
                label: "Pagos: *",
                placeholder: "Seleccione los pagos",
                helperText: "Seleccione los pagos relacionados con el comprobante de recepción de pagos.",
                tooltip: "Pagos asociados al comprobante de recepción de pagos.",
            },

            area: {
                label: "Área funcional: *",
                placeholder: "Seleccione el área",
                helperText: "Seleccione el área a la que pertenece el comprobante de recepción de pagos.",
                tooltipSimple: "Área funcional asociada al comprobante.",
                tooltipAuto: "Única área funcional disponible para el pago seleccionado.",
                tooltipSelect: "Seleccione un pago para cargar las áreas disponibles.",
            },

            partner_fiscal_id: {
                label: "RFC del emisor:",
                placeholder: "RFC del emisor",
                tooltip: "RFC del emisor del comprobante de recepción de pagos."
            },

            company_fiscal_id: {
                label: "RFC del receptor:",
                placeholder: "RFC del receptor",
                tooltip: "RFC del receptor del comprobante de recepción de pagos."
            },

            receiver_tax_regime: {
                label: "Régimen fiscal del receptor:",
                placeholder: "Régimen fiscal del receptor",
                tooltip: "Régimen fiscal del receptor del comprobante de recepción de pagos."
            },

            issuer_tax_regime: {
                label: "Régimen fiscal del emisor:",
                placeholder: "Régimen fiscal del emisor",
                tooltip: "Régimen fiscal del emisor del comprobante de recepción de pagos."
            },

            folio: {
                label: "Folio:",
                placeholder: "Folio",
                tooltip: "Folio del comprobante de recepción de pagos."
            },

            date: {
                label: "Fecha:",
                placeholder: "Fecha",
                tooltip: "Fecha de emisión del comprobante de recepción de pagos."
            },

            xml_file: {
                label: "XML del comprobante de recepción de pagos: *",
                tooltip: "Archivo XML del comprobante de recepción de pagos."
            }
        
        },
        files: {
            label: "Archivos del comprobante de recepción de pagos: *",
            placeholderMultiple: "Suelte aquí los archivos para comenzar a cargarlos",
            placeholderSingle: "Suelte el archivo aquí para comenzar a cargarlo",
            helperTextFiles: "Seleccione los archivos del comprobante de recepción de pagos.",
            helperTextPdf: "Debe cargar la representación impresa en PDF del comprobante de recepción de pagos.",
            helperTextXml: "Debe cargar un archivo XML.",
            tooltip: "Seleccione los archivos del comprobante de recepción de pagos.",
            invalidFileSize: "El tamaño máximo por archivo es de 5 MB.",
            invalidFileSizeMessageSummary: "Archivo demasiado grande.",
            invalidFileType: "Solo se permiten archivos \"{{extensions}}\".",
            invalidAllFilesSize: "El tamaño máximo de los archivos es de 25 MB.",
            hasSameFile: "No es necesario volver a cargar el archivo {{xmlName}} en la sección Archivos.",
            hasMatchingPDF: "Es necesario cargar la representación impresa en PDF del comprobante de recepción de pagos y que tenga el mismo nombre que el archivo XML {{xmlBaseName}}.",
        },
        uploadInstructions: {
            header: "Cargar un comprobante de recepción de pagos:",
            step1: "Seleccione uno o varios pagos.",
            step3: "Seleccione el XML del comprobante de recepción de pagos, el sistema lo validará automáticamente.",
            step4: "Una vez validado el XML, se mostrarán las observaciones del archivo que pudiera contener, marcadas con un signo de advertencia amarillo. Si no contiene errores críticos marcados en rojo y con una X, se mostrarán los campos del archivo XML para que pueda continuar.",
            step5: "Seleccione los archivos asociados al comprobante de recepción de pagos en el campo 'Archivos de comprobante de recepción de pagos'.",
            step6: "Asegúrese de que los archivos no superen los 5 MB cada uno y que en total no superen los 25 MB.",
            footer: "Puede seleccionar varios archivos a la vez, pero asegúrese de que al menos uno sea un PDF. Si selecciona archivos que no cumplen con estos requisitos, se mostrará un mensaje de error."
        },
        uploadInstructionsPartner: {
            header: "Cargar un comprobante de recepción de pagos:",
            step1: "Seleccione uno o varios pagos.",
            step2: "Seleccione el XML del comprobante de recepción de pagos, el sistema lo validará automáticamente.",
            step3: "Una vez validado el XML, se mostrarán las observaciones del archivo que pudiera contener, marcadas con un signo de advertencia amarillo. Si no contiene errores críticos marcados en rojo y con una X, se mostrarán los campos del archivo XML para que pueda continuar.",
            step4: "Seleccione los archivos asociados al comprobante de recepción de pagos en el campo 'Archivos de comprobante de recepción de pagos'.",
            step5: "Asegúrese de que los archivos no superen los 5 MB cada uno y que en total no superen los 25 MB.",
            footer: "Puede seleccionar varios archivos a la vez, pero asegúrese de que al menos uno sea un PDF. Si selecciona archivos que no cumplen con estos requisitos, se mostrará un mensaje de error."   
        },
        authInstructions: {
            header: "Autorizar un comprobante de recepción de pagos:",
            step1: "Revise los archivos PDF y XML del comprobante de recepción de pagos.",
            step2: "Si el comprobante es correcto, presione el botón 'Autorizar'.",
            step3: "Si el comprobante es incorrecto, presione el botón Rechazar para abrir el campo de comentarios de rechazo.",
            step4: "Ingrese los comentarios de rechazo y vuelva a presionar el botón Rechazar.",
            footer: "Asegúrese de que los comentarios sean claros y específicos para que el proveedor pueda corregir el CRP."   
        }
    }
}

export default crp;