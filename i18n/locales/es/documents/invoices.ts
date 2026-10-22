import { Toast } from "primereact/toast";

const invoices = {
    titleAllInvoices: "Todas las facturas",
    titleAllInvoicesTooltip: "Pantalla para ver todas las facturas.",
    titleUpload: "Cargar y revisar facturas",
    titleUploadProvider: "Cargar facturas",
    titleAccepted: "Facturas revisadas",
    titleAcceptanceRejected: "Facturas rechazadas en la revisión",
    titleAuthorizationRejected: "Facturas rechazadas en la autorización",
    titleUploadTooltip: "Pantalla para cargar y revisar las facturas que no han sido aceptadas.",
    titleAcceptedTooltip: "Pantalla para ver las facturas aceptadas.",
    titleReviewRejectedTooltip: "Pantalla para ver las facturas rechazadas en la revisión.",
    titleAcceptanceRejectedTooltip: "Pantalla para ver las facturas rechazadas en aceptación.",
    titleAuthorizationRejectedTooltip: "Pantalla para consultar las facturas rechazadas en autorización.",

    titleAuthorized: 'Facturas autorizadas',
    titleInAuthorization: 'Facturas en autorización',
    //titleAuthorizedRejected: 'Facturas rechazadas en la autorización',
    titleAuthorizedTooltip: 'Pantalla para revisar las facturas autorizadas.',
    titleInAuthorizationTooltip: 'Pantalla para revisar las facturas en proceso de autorización.',
    //titleAuthorizedRejectedTooltip: 'Pantalla para revisar las facturas rechazadas.',

    btnOpenDialogUpload: "Cargar factura",
    tooltipBtnOpenDialogUpload: "Cargar una nueva factura.",
    filterByCompany: {
        placeholder: 'Filtrar empresa',
    },

    viewInstructions: {
        uploadInvoice: {
            header: "Cargar una nueva factura:",
            step1: "Presiona el botón 'Cargar factura'",
            step2: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para cargar una nueva factura.",
        },
        deleteRejectedInstructions: {
            header: "Volver a cargar una factura rechazada:",
            step1: "Diríjase a la vista de 'Rechazadas' (En la pestaña de 'Recepción de Facturas' si fue rechazada en la revisión o 'Monitorear autorizaciones' si fue rechazada en la autorización).",
            step2: "Localice en la tabla la factura rechazada que desea volver a cargar.",
            step3: "Ubique la columna 'Eliminar' y haga clic en el botón rojo de 'Eliminar' correspondiente al renglón de su factura.",
            step4: "Confirme la eliminación en la ventana que aparecerá en pantalla.",
            footer: `Una vez eliminado el registro, podrá iniciar el proceso para cargar su factura.
             Estas mismas instrucciones están disponibles en la vista 'Rechazadas'.`,
        },
        searchInvoices: {
            header: "Filtrar facturas:",
            step1: "Utiliza el campo 'Buscar' para filtrar las facturas por cualquier campo visible en la tabla.",
            step2: "Escribe el texto que deseas buscar y la tabla se actualizará automáticamente para mostrar solo las facturas que coincidan con el texto ingresado.",
            step3: "Utiliza el selector 'Tipo' para filtrar por el tipo de egreso de la factura.",
            step4: "Presiona el botón 'Limpiar filtros' para limpiar todos los filtros aplicados y mostrar todas las facturas nuevamente."
        },
        sortColumn: {
            header: "Ordenar por columna:",
            step1: "Haz clic en el encabezado de cualquier columna para ordenar las facturas por esa columna en orden ascendente o descendente.",
            step2: "El ícono de flecha junto al encabezado de la columna indica el orden actual (ascendente o descendente).",
            step3: "Para ordenar por varias columnas, mantenga presionada la tecla 'Ctrl' mientras selecciona los encabezados de las columnas que desea ordenar."
        },
        reloadView: {
            header: "Actualizar vista:",
            step1: "Presiona el botón de 'Recargar' para actualizar la vista y cargar los datos más recientes.",
        },
        reviewInvoice: {
            header: "Revisar una factura:",
            step1: "Haz doble clic en la fila de la factura que deseas revisar.",
            step2: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para revisar la factura.",
        },
        authFactura: {
            header: "Autorizar una factura:",
            step1: "Haga doble clic en la fila de la factura que desea autorizar.",
            step2: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para autorizar la factura."
        },
        authFacturaInMonitor: {
            header: "Autorizar una factura:",
            step1: "Diríjase a la vista de 'Pendientes para mí' en la pestaña de 'Autorizar facturas'.",
            step2: "Haga doble clic en la fila de la factura que desea autorizar.",
            step3: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para autorizar la factura.",
            footer: "Estas mismas instrucciones están disponibles en la vista 'Pendientes para mí'."
        },
        downloadFiles: {
            header: "Descargar archivos de una factura:",
            step1: "Presiona el botón de descarga en la columna 'Archivos' de la factura que deseas descargar.",
            step2: "Se descargará un archivo ZIP que contiene los archivos PDF y XML de la factura.",
        },
        cancelFlowAuthInstructions: {
            header: "Cancelar el proceso de autorización de una factura:",
            step1: "Haz doble clic en la fila de la factura que deseas cancelar su autorización.",
            step2: "Se abrirá un cuadro de diálogo.",
            step3: "Dentro del diálogo ingrese un comentario en 'Comentarios para cancelación' con el motivo de la cancelación y presione el botón 'Cancelar proceso de autorización'.",
        },
        deleteRejectedInstructionsShort: {
            header: "Eliminar factura rechazada:",
            step1: "Localice en la tabla la factura rechazada que desea volver a cargar.",
            step2: "Ubique la columna 'Eliminar' y haga clic en el botón rojo de 'Eliminar' correspondiente al renglón de su factura.",
            step3: "Confirme la eliminación en la ventana que aparecerá en pantalla.",
            footer: `Una vez eliminado el registro, podrá iniciar el proceso para cargar su factura.`,
        },
    },

    confirmations: {
        sendToUpload: {
            message: '¿Quieres enviar esta factura: \"{{folio}}\" a la sección \'Cargar facturas\'?',
            header: "Confirma envío"
        },
        confirmPaymentDay: {
            message: "¿Quieres poner {{date}} como día de pago?",
            header: "Confirma día"
        },
        confirmMarkNormalInvoice: {
            message: "Se detectó que el XML es de un anticipo. ¿Estás seguro de marcarlo como factura normal?",
            header: "Atención"
        },
        deleteInvoice: {
            message: "¿Quieres eliminar esta factura: {{folio}}?",
            header: "Confirma eliminación"
        }
    },

    uploadDialog: { 
        btnAcceptSendAuth: "Aceptar y enviar a autorizar",
        headerCreate: "Cargar factura",
        headerReview: "Aceptar o rechazar factura",
        headerView: "Revisar factura",
        headerEdit: "Modificar factura",
        headerAuthorization: "Autorizar o rechazar factura",
        btnHowUploadInvoice: "¿Cómo cargar una factura?",
        btnHowReviewInvoice: "¿Cómo revisar una factura?",
        btnHowAuthInvoice: "¿Cómo autorizar una factura?",
        selectProviderForHelp: "Por favor, seleccione un proveedor en el formulario para poder visualizar las instrucciones correctas de carga.",

        uploadInstructions: {
            header: "Cargar una factura:",
            step1: "Seleccione una o varias referencias para la factura.",
            step2: "Si se seleccionó más de una referencia, indique el monto que se aplicará a cada una.",
            step3: "Seleccione el XML de la factura, una vez subido este se validará automáticamente.",
            step4: "Una vez validado el XML, se mostrarán las observaciones que pueda contener. Las advertencias se identificarán con un ícono amarillo. Si el archivo no contiene errores críticos, identificados con un ícono rojo y una X, se mostrarán los datos del XML para que pueda continuar.",
            step5: "Seleccione los archivos asociados a la factura en el campo 'Archivos de factura'.",
            step6: "Asegúrese de que los archivos no superen 5 MB cada uno y que en total no superen los 25 MB.",
            footer: `Puedes seleccionar varios archivos a la vez, pero asegúrate de que al menos uno sea un PDF.
             Si se seleccionan archivos que no cumplen con estos requisitos, se mostrará un mensaje de error.`
        },
        uploadInstructionsForForeign: {
            header: "Cargar una factura foránea:",
            step1: "Todos los campos marcados con un * son obligatorios.",
            step2: "Seleccione una o varias referencias para la factura (si aplica), si no, seleccione la opción 'Sin referencia'.",
            step3: "Si se seleccionó mas de una referencia, coloca el monto que se aplicará a cada referencia.",
            step4: "Para el 'Folio' ingrese la serie (si aplica) y el folio de la factura en formato serie-folio. Si la serie no aplica, ingrese únicamente el folio.",
            step5: "Ingrese el resto de los datos de la factura. Recuerde que los campos marcados con un * son obligatorios.",
            step6: "Seleccione los archivos asociados a la factura en el campo 'Archivos de factura'. IMPORTANTE: el primer archivo PDF que cargue debe ser su Factura Comercial.",
            step7: "Asegúrese de que los archivos no superen 5 MB cada uno y que en total no superen los 25 MB.",
            footer: `Puedes seleccionar varios archivos a la vez, pero asegúrate de que al menos uno sea un PDF.
             Si se seleccionan archivos que no cumplen con estos requisitos, se mostrará un mensaje de error.`
        },
        foreignWarning:{
            title: "Aviso para proveedores extranjeros",
            descriptionPart1: "Por favor, asegúrese de cargar",
            descriptionHighlight: "primero",
            descriptionPart2: "el PDF principal de su",
            documentName: "Factura",
            descriptionPart3: ".",
            footerPart1: "El documento que quede",
            footerHighlight: "en la parte superior",
            footerPart2: "en la lista será registrado como el oficial, y los demás se guardarán como anexos."
        },
        reviewInstructions: {
            header: "Revisar una factura:",
            step1: "Revise los archivos PDF y XML de la factura.",
            step2: "Si la factura tiene una referencia asociada a una orden de compra registrada en el sistema, los archivos relacionados con dicha orden se mostrarán al final de los archivos de la factura.",
            step3: "Si la factura es correcta, presiona el botón 'Aceptar'.",
            step4: "Si la factura es incorrecta, ingrese un comentario en 'Comentarios aprobación/rechazo' con el motivo del rechazo y presione el botón 'Rechazar'.",
            footer: "Asegúrese de que los comentarios sean claros y específicos para que el proveedor pueda corregir la factura."
        },
        authInstructions: {
            header: "Autorizar una factura:",
            step1: "Revise los archivos PDF y XML de la factura.",
            step2: "Si la factura tiene una referencia asociada a una orden de compra registrada en el sistema, los archivos relacionados con dicha orden se mostrarán al final de los archivos de la factura.",
            step3: "Si la factura es correcta, presiona el botón 'Autorizar'.",
            step4: "Si la factura es incorrecta, ingrese un comentario en 'Sus comentarios de la autorización' con el motivo del rechazo y presione el botón 'Rechazar'.",
            footer: "Asegúrese de que los comentarios sean claros y específicos para que el proveedor pueda corregir la factura."
        },
        company:  {
            label: "Empresa: *",
            placeholder: "Seleccione una empresa",
            helperText: "Por favor seleccione una empresa.",
            tooltip: "Empresa receptora de la factura.",
            tooltipReview: "Empresa receptora de la factura.",
        },
        provider: {
            label: "Proveedor: *",
            placeholder: "Seleccione un proveedor",
            helperText: "Por favor seleccione un proveedor.",
            tooltip: "Proveedor que emitió la factura.",
            tooltipReview: "Proveedor que emitió la factura.",
        },
        reference: {
            label: "Referencia: *",
            placeholder: "Seleccione una referencia",
            placeholderEmpty: "No hay referencias disponibles",
            helperText: "Por favor seleccione una referencia.",
            tooltip: "Referencia asociada a la factura.",
            tooltipReview: "Referencia asociada a la factura.",
            withOutReferenceOption: "Sin referencia",
            checkboxAllReferences: "Mostrar todas",
            tooltipcheckboxAllReferences: "Incluir referencias disponibles que ya han sido facturadas.",
            referenceWarning: "La referencia ya esta facturada"
        },
        areas: {
            label: "Área: *",
            placeholder: "Seleccione un área",
            placeholderEmpty: "No hay áreas disponibles.",
            helperText: "Por favor seleccione un área.",
            tooltip: "Área funcional de la factura.",
            tooltipReview: "Área funcional a la que va dirigida la factura.",
        },
        references: {
            title: "Referencias asociadas a la factura",
            withOut: "Esta factura no tiene una referencia asociada.",
            referenceData: "Datos de la referencia",
            ticketData: "Datos del boleto ",
            etys: "Partidas de la referencia.",
            historyAuth: "Historial de autorización de la referencia",
        },
        referenceData: {
            title: "Referencia:",
            
            nature: {
                label: "Tipo de contabilización:",
                placeholder: "",
                tooltip: "Determina el destino contable de la compra.",
            },
            concept: {
                label: "Concepto/gasto:",
                placeholder: "Concepto/gasto",
                tooltip: "Concepto de gasto de la referencia."
            },
            cost_profit_center: {
                label: "Centro de costo:",
                placeholder: "Centro de costo",
                tooltip: "Centro de costo de la referencia."
            },
            amount: {
                label: "Monto asignado de la referencia:",
                placeholder: "Monto asignado a la referencia",
                tooltip: "Cantidad de dinero de la factura que corresponde a esta referencia."
            },
            notes: {
                label: "Notas de la referencia:",
                placeholder: "Notas de la referencia",
                tooltip: "Notas de la referencia."
            },
        },
        xml_file: {
            label: "XML de la factura: *",
            tooltip: "Archivo XML de la factura.",
            requireReference: "(Debe seleccionar una referencia para cargar el XML)",
            requireReferenceTooltip: "Solo Compradores pueden cargar facturas sin referencia."
        },
        xml_errors: {
            label: "Errores del XML de la factura:",
            tooltip: "Para continuar con la carga de la factura solucione estos problemas."
        },
        xml_warnings: {
            label: "Observaciones del XML de la factura:",
            tooltip: "Observaciones del archivo XML de la factura, puede continuar con la carga."
        },
        invoiceData: {
            title: "Datos de la factura",
        },
        serie: {
            label: "Serie:",
            placeholder: "Ingrese la serie",
            helperText: "Por favor ingrese la serie.",
            tooltip: "Serie de la factura, si aplica.",
            tooltipReview: "Serie asociada a la factura.",
        },
        folio: {
            label: "Folio: *",
            placeholder: "Serie-Folio*",
            helperText: "Por favor ingrese el folio de la factura.",
            tooltip: "Serie(si aplica)-Folio asociado a la factura.",
            tooltipReview: "Folio asociado a la factura.",
        },
        xml_date: {
            label: "Fecha de emisión: *",
            placeholder: "Seleccione una fecha",
            helperText: "Por favor seleccione una fecha.",
            tooltip: "Fecha de emisión de la factura.",
            tooltipReview: "Fecha de emisión asociada a la factura.",
        },
        payment_method: {
            label: "Método de pago:",
            placeholder: "Ingrese método de pago",
            helperText: "Por favor seleccione un método de pago.",
            tooltip: "Método de pago de la factura.",
            tooltipReview: "Método de pago asociado a la factura.",
        },
        paymentForm: {
            label: "Forma de pago:",
            placeholder: "Ingrese forma de pago",
            tooltip: "Medio con el que se realizó el pago:\n01: Efectivo.\n03: Transferencia electrónica de fondos (SPEI).\n04: Tarjeta de crédito.\n28: Tarjeta de débito.\n99: Por definir",
        },
        rfc_issuer: {
            label: "RFC del emisor: *",
            placeholder: "Ingrese RFC emisor",
            helperText: "Por favor ingrese el RFC del emisor.",
            tooltip: "Clave del Registro Federal de Contribuyentes del emisor de la factura.",
            tooltipReview: "Clave del Registro Federal de Contribuyentes del emisor de la factura.",
        },
        tax_regime_issuer: {
            label: "Régimen fiscal delemisor:",
            placeholder: "Ingrese régimen fiscal emisor",
            helperText: "Por favor ingrese el régimen fiscal del emisor.",
            tooltip: "Tratamiento fiscal asignado por el SAT para el emisor de la factura.",
            tooltipReview: "Tratamiento fiscal asignado por el SAT para el emisor de la factura."
        },
        rfc_receiver: {
            label: "RFC receptor: *",
            placeholder: "Ingrese RFC receptor",
            helperText: "Por favor ingrese el RFC del receptor.",
            tooltip: "Clave del Registro Federal de Contribuyentes del receptor de la factura.",
            tooltipReview: "Clave del Registro Federal de Contribuyentes del receptor de la factura.",
        },
        tax_regime_receiver: {
            label: "Régimen fiscal del receptor: *",
            placeholder: "Ingrese régimen fiscal receptor",
            helperText: "Por favor ingrese el régimen fiscal del receptor.",
            tooltip: "Tratamiento fiscal asignado por el SAT para el receptor de la factura.",
            tooltipReview: "Tratamiento fiscal asignado por el SAT para el receptor de la factura.",
        },
        use_cfdi: {
            label: "Uso CFDI:",
            placeholder: "Ingrese uso CFDI",
            helperText: "Por favor ingrese el uso CFDI.",
            tooltip: "Propósito fiscal que el receptor le dará a esta factura.",
            tooltipReview: "Propósito fiscal que el receptor le dará a esta factura.",
        },
        currency: {
            label: "Moneda: *",
            placeholder: "Seleccione la moneda",
            helperText: "Por favor seleccione la moneda de la factura.",
            tooltip: "Moneda de la factura.",
            tooltipReview: "Moneda de la factura.",
        },
        exchange_rate: {
            label: "Tipo de cambio:",
            placeholder: "Ingrese el tipo de cambio",
            helperText: "Por favor ingrese el tipo de cambio.",
            tooltip: "Tipo de cambio monetario de la factura.",
            tooltipReview: "Tipo de cambio monetario de la factura.",
        },
        amount: {
            label: "Total: *",
            placeholder: "Ingrese monto total",
            helperText: "Por favor ingrese el monto total.",
            tooltip: "Monto total de la factura.",
            tooltipReview: "Monto total de la factura.",
        },
        
        account_tag: {
            label: "Etiqueta contable:",
            placeholder: "Seleccione etiqueta contable",
            tooltip: "Etiqueta para clasificar la factura en los registros contables.",
        },
        type_load: {
            label: "Tipo de carga:",
            placeholder: "Seleccione tipo de carga",
            tooltip: "Método por el cual se cargó la factura en el sistema.",
        },
        paymentData: {
            title: "Datos del pago",
        },
        creditDays: {
            label: "Días de crédito:",
            tooltip: "Plazo de tiempo para realizar el pago de la factura."
        },
        payDay: {
            label: "Fecha de pago:",
            placeholder: "Seleccione una fecha",
            helperText: "Por favor seleccione una fecha de pago.",
            tooltip: "Fecha de pago de la factura solicitada por el comprador.",
            tooltipReview: "Fecha de pago solicitada por el comprador de la factura.",
            toast: "Ingrese una fecha de pago de la factura."
        },
        edit_payDay: {
            label: "Cambiar fecha de pago",
        },
        notes_manual_payment_date: {
            label: "Comentarios cambio de fecha de pago",
            tooltip: "Ingrese los comentarios del motivo del cambio de fecha de pago",
            helperText: "Ingrese motivo de cambio de fecha de pago",
            toast: "Ingrese comentarios cambio de fecha de pago"
        },
        proportionOption: {
            label: "Proporción de pago:",
            placeholder: "Seleccione la proporción de pago",
            helperText: "Por favor seleccione una opción.",
            tooltip: "Proporción de pago de la factura.",
            tooltipReview: "Esta es la proporción de pago de la factura.",
        },
        percentOption: {
            label: "% de pago:",
            placeholder: "Seleccione porcentaje de pago",
            helperText: "Por favor seleccione una opción.",
            tooltip: "Porcentaje de pago de la factura.",
            tooltipReview: "Porcentaje de pago de la factura.",
        },
        amountOption: {
            label: "Monto de pago:",
            placeholder: "Monto de pago",
            helperText: "Por favor ingrese el monto de pago.",
            tooltip: "Ingrese el monto de pago de la factura.",
            tooltipReview: "Monto de pago de la factura.",
        },
        acceptNotes: {
            label: "Descripción de la factura:",
            placeholder: "Ej: Servicio de consultoría",
            helperText: "Describe el concepto o servicio por el que se emite esta factura.",
            tooltip: "Breve descripción que identifique el propósito de la factura.",
            tooltipReview: "Descripción de la factura ingresada por el usuario.",
            toast: "Ingrese descripción de la factura."
        },
        paymentInstruction: {
            label: "Instrucciones de pago:",
            placeholder: "Ej: Pagar en dólares",
            helperText: "Indica los métodos y detalles específicos para realizar el pago.",
            tooltip: "Pasos, métodos o información clave que se deben seguir para pagar.",
            tooltipReview: "Instrucciones de pago proporcionadas para el cliente.",
        },
        is_payment_loc: {
            label: "Pagar en pesos mexicanos:"
        },
        files: {
            label: "Archivos de la factura: *",
            placeholderMultiple: "Suelte aquí los archivos para comenzar a cargarlos",
            placeholderSingle: "Suelte el archivo aquí para comenzar a cargarlo",
            maxUnitLimit: "Límite máximo por archivo:",
            invalidFileTypeDetail: "El formato del archivo \"{{name}}\" no está permitido.",
            invalidFileSizeDetail: "El archivo \"{{name}}\" supera el peso máximo individual permitido ({{size}}).",
            helperTextFiles: "Seleccione los archivos de la factura.",
            helperTextPdf: "Debe cargar la representación impresa en PDF del comprobante.",
            helperTextXml: "Debe cargar un archivo XML.",
            tooltip: "Archivos asociados a la factura.",
            invalidFileSize: "El tamaño máximo por archivo es de 5 MB.",
            invalidFileSizeMessageSummary: "Archivo demasiado grande.",
            invalidFileType: "Solo se permiten archivos \"{{extensions}}\".",
            invalidAllFilesSize: "El tamaño máximo de los archivos es de 25 MB.",
            hasSameFile: "No es necesario volver a cargar el archivo {{xmlName}} en la sección Archivos.",
            hasMatchingPDF: "Es necesario que se cargue la representación impresa en PDF del comprobante y que tenga el mismo nombre que el archivo XML {{xmlBaseName}}.",
        },
        animationSuccess: {
            title: "Factura cargada.",
            text: "La factura se ha cargado correctamente.",
            titleReview: "Factura revisada.",
        },
        animationError: {
            title: "Error al cargar la factura.",
            text: "Ocurrió un error al cargar la factura, vuelve a intentarlo más tarde.",
            titleReview: "Error al revisar la factura.",
        },
        errors: {
            uploadError: "Error al cargar la factura. Por favor, verifica los archivos y referencia y vuelve a intentarlo.",
            getReferencesError: "Error al obtener las referencias. Por favor, intenta nuevamente más tarde.",
            updateStatusError: "Error al actualizar el estado de la factura. Por favor, intenta nuevamente más tarde.",
            uploadValidXmlError: "Error al enviar el xml para su validación.",
            getCurrenciesError: "Error al obtener tipos de cambio.",
            getAuthorizationHistoryError: "Error al obtener el historial de autorización:",
            deleteInvoiceError: "Error al eliminar la factura: {{statusText}}",
            deleteInvoiceErrorFallback: "Error al eliminar la factura"
        },
        rejectComments: {
            label: "Comentarios aprobación/rechazo:",
            placeholder: "Ingrese los comentarios.",
            helperText: "Por favor ingrese los comentarios de rechazo. Luego vuelve a presionar el botón de rechazar.",
            tooltip: "Ingrese los comentarios de rechazo si la factura es rechazada. Luego vuelve a presionar el botón de rechazar.",
            tooltipReview: "Estos son los comentarios de aprobación/rechazo de la factura.",
            toast: "Ingrese un comentario de rechazo de la factura"
        },
        week: {
            label: "Sem.:",
            placeholder: "Sem.",
            tooltip: "Número de semana de la factura.",
            tooltipReview: "Número de semana de la factura."
        },
        is_advance: {
            label: "Es anticipo",
            tooltip: "Indica si la factura es un anticipo.",
        },
        advance_application: {
            label: "Aplicación anticipo:",
            tooltip: "Elige cómo comprobar el pago adelantado: 'Descuento directo' para restarlo en esta misma factura, o 'Nota de crédito' para emitir un documento de egreso vinculado.",
            placeholder: "Seleccione aplicación anticipo",
            errorMessage: "Por favor, seleccione aplicación anticipo."
        },
        invoiceWithOutOc: "No se seleccionó una referencia para esta factura",
        titleInvoiceWithOutOc: "No seleccionó una orden de compra para esta factura",
        expiredDate: {
            label: "Fecha vencimiento",
            checkBoxLabel: "Definir fecha vencimiento",
            placeholder: "Seleccione una fecha",
            helperText: "Por favor seleccione una fecha de vencimiento.",
            tooltip: "Aplica para facturas de mas de una parcialidad",
        },
        net_weight: {
            label: "Peso neto en kg",
            placeholder: "",
            tooltip: "Peso neto en kilogramos indicado en el boleto",
        },
        gross_weight: {
            label: "Peso bruto en kg",
            placeholder: "",
            tooltip: "Peso bruto en kilogramos indicado en el boleto",
        },
        productor_name: {
            label: "Productor",
            placeholder: "",
            tooltip: "Nombre del productor indicado en el boleto",
        },
        purchase_origin_location: {
            label: "Origen compra",
            placeholder: "",
            tooltip: "Origen de la compra indicado en el boleto",
        },
        purchase_origin_zone: {
            label: "Origen del insumo",
            placeholder: "",
            tooltip: "Origen del insumo indicado en el boleto",
        },
        validateToSat: "Validando CFDI ante el SAT",
        
        cancelFlowAuth: {
            labelButton: "Cancelar proceso de autorización",
            successMessage: "Se ha cancelado el proceso de autorización, su factura ha pasado a la pantalla de 'carga de facturas'.",
            errorMessage: "Error al cancelar el proceso de autorización:"
        }
    },
    errors: {
        getInvoicesError: "Error al obtener las facturas. Por favor, intenta nuevamente más tarde.",
        getReferencesError: "Error al obtener las referencias. Por favor, intenta nuevamente más tarde.",
        downloadFilesError: "Error al descargar los archivos. Por favor, intenta nuevamente más tarde.",
        getFunctionalAreasError: "Error al obtener las áreas funcionales. Por favor, intenta nuevamente más tarde.",
        getPartnersError: "Error al obtener los proveedores. Por favor, intenta nuevamente más tarde.", 
        getCompaniesError: "Error al obtener las empresas. Por favor, intenta nuevamente más tarde.",
        getUrlsFilesError: "No se encontraron archivos para la factura.",
        getAreasError: "Error al obtener las áreas funcionales. Por favor, intenta nuevamente más tarde.",
        getPaymentMethodsError: "Error al obtener los métodos de pago. Por favor, intenta nuevamente más tarde.",
        getUseCfdiError: "Error al obtener los usos de CFDI. Por favor, intenta nuevamente más tarde.",
    },
    btnDownloadFiles: "Descargar archivos",
    dpsDateLimitText: "Fecha límite de carga de facturas:",
    dpsDateAfterLimitText: "La fecha límite para cargar facturas fue.",
    
    invoicesTable: {
        columns: {
            company: "Empresa",
            provider_name: "Proveedor",
            serie: "Serie",
            folio: "Folio",
            reference: "Referencia",
            amount: "Total",
            currencyCode: "Moneda",
            acceptance: "Aceptación",
            authorization: "Autorización",
            files: "Archivos",
            date: "Fecha",
            payday: "Fecha pago",
            payment_percentage: "% pago",
            useCfdi: "Tipo"
        },
        currentPageReportTemplate: "{first} - {last} de {totalRecords} facturas",
        emptyMessage: "Sin datos para mostrar.",   
    },
    helpText: {
        buttonLabel: "Videos de ayuda",
        buttonTooltip: "Ver tutorial de inicio de sesión",
        dialogHeader: "Manual de Usuario",
    },
    comments: {
        reviewTitle: "Comentarios de la revisión",
        authorizationTitle: "Comentarios de la autorización",
        authorizationLabel: "Comentarios de la autorización:",
        authorizationTooltip: "Comentarios de la autorización o rechazo de la factura.",
        yourAuthorizationCommentsLabel: "Sus comentarios de la autorización:",
        tooltipYourAuthorizationComments: "Sus comentarios del motivo de la autorización o rechazo* de la factura.",
        yourAuthorizationCommentsError: "Ingrese comentarios para rechazar la factura.",
        cancelAuthorizationLabel: "Comentarios para cancelación:",
        cancelAuthorizationTooltip: "Para suspender la autorización de la factura ingrese el motivo de la cancelación.",
        cancelAuthorizationError: "Por favor, ingrese los comentarios para la cancelación."
    },
    invoiceFiles: {
        title: "Archivos de la factura",
    },
    aditionalInvoiceFiles: {
        label: "Archivos adicionales:",
        tooltip: "Archivos adicionales de la factura."
    },
    authHistory: {
        label: "Historial de autorizaciones:",
    },
    invoiceAuthHistory: {
        title: "Historial de autorización de la factura",
    },
    success: {
        sendUpload: "Registro enviado a la sección 'Cargar facturas'"
    }
}

export default invoices;