import { Tooltip } from "chart.js";

const invoices = {
    titleAllInvoices: "Todas las facturas",
    titleAllInvoicesTooltip: "Pantalla para ver todas las facturas",
    titleUpload: "Cargar y revisar facturas",
    titleUploadProvider: "Cargar facturas",
    titleAccepted: "Facturas revisadas",
    titleAcceptanceRejected: "Facturas rechazadas en la revisión",
    titleAuthorizationRejected: "Facturas rechazadas en autorización",
    titleUploadTooltip: "Pantalla para cargar las facturas",
    titleAcceptedTooltip: "Pantalla para ver las facturas aceptadas",
    titleAcceptanceRejectedTooltip: "Pantalla para ver las facturas rechazadas en aceptación",
    titleAuthorizationRejectedTooltip: "Pantalla para ver las facturas rechazadas en autorización",

    titleAuthorized: 'Facturas autorizadas',
    titleInAuthorization: 'Facturas en autorización',
    titleAuthorizedRejected: 'Facturas rechazadas en la autorización',
    titleAuthorizedTooltip: 'Pantalla para revisar las facturas autorizadas',
    titleInAuthorizationTooltip: 'Pantalla para revisar las facturas en proceso de autorización',
    titleAuthorizedRejectedTooltip: 'Pantalla para revisar las facturas rechazadas',

    btnOpenDialogUpload: "Cargar factura",
    tooltipBtnOpenDialogUpload: "Cargar una nueva factura.",
    filterByCompany: {
        placeholder: 'Filtrar empresa',
    },
    uploadDialog: { 
        btnAcceptSendAuth: "Aceptar y enviar a autorizar",
        headerCreate: "Cargar factura",
        headerReview: "Aceptar o rechazar factura",
        uploadInstructions: {
            header: "Para cargar una factura, sigue estos pasos:",
            step1: "Selecciona una o varias referencias para la factura.",
            step2: "Coloca el monto que se aplicará a cada referencia.",
            step3: "Selecciona el XML de la factura para su validación, en cuanto selecciones el xml de la factura este se validará automáticamente.",
            step4: "Una vez validado el XML, se mostrarán las observaciones del archivo que pudiera contener marcados con un signo de advetencia amarillo, si no contiene errores criticos marcados en rojo y con una X, se mostrarán los campos del archivo XML para que pueda continuar.",
            step5: "Selecciona los archivos asociados a la factura en el campo 'Archivos de factura'.",
            step6: "Asegúrate de que los archivos no superen 5 MB cada uno y que en total no superen los 25 MB.",
            footer: `Puedes seleccionar varios archivos a la vez, pero asegúrate de que al menos uno sea un PDF.
             Si seleccionas archivos que no cumplen con estos requisitos, se mostrará un mensaje de error.`
        },
        uploadInstructionsForForeign: {
            header: "Para cargar una factura, sigue estos pasos:",
            step1: "Todos los campos marcados con un * son obligatorios.",
            step2: "Selecciona una o varias referencias para la factura (si aplica), si no, selecciona la opción 'Sin referencia'.",
            step3: "Coloca el monto que se aplicará a cada referencia.",
            step4: "Ingresa la serie (si aplica) y el folio de la factura en formato serie-folio si no aplica la serie solo ingresa folio.",
            step5: "Ingresa el resto de campos de la factura, recuerda que los campos marcados con un * son obligatorios.",
            step6: "Selecciona los archivos asociados a la factura en el campo 'Archivos de factura'.",
            step7: "Asegúrate de que los archivos no superen 5 MB cada uno y que en total no superen los 25 MB.",
            footer: `Puedes seleccionar varios archivos a la vez, pero asegúrate de que al menos uno sea un PDF.
             Si seleccionas archivos que no cumplen con estos requisitos, se mostrará un mensaje de error.`
        },
        reviewInstructions: {
            header: "Para revisar una factura, sigue estos pasos:",
            step1: "Revisa los archivos PDF y XML de la factura.",
            step2: "Si se selecciono una referencia, que este asociada a una OC que este en el sistema se mostraran los archivos al final de los archivos de la propia factura.",
            step3: "Si la factura es correcta, presiona el botón Aceptar.",
            step4: "Si la factura es incorrecta, presiona el botón Rechazar para abrir el campo de comentarios de rechazo.",
            step5: "Ingresa los comentarios de rechazo y vuelve a presionar el botón Rechazar.",
            footer: "Asegúrate de que los comentarios sean claros y específicos para que el proveedor pueda corregir la factura."
        },
        provider: {
            label: "Proveedor: *",
            placeholder: "Selecciona un proveedor",
            helperText: "Por favor selecciona un proveedor.",
            tooltip: "Selecciona el proveedor asociado a la factura.",
            tooltipReview: "Este es el proveedor asociado a la factura.",
        },
        company:  {
            label: "Empresa: *",
            placeholder: "Selecciona una empresa",
            helperText: "Por favor selecciona una empresa.",
            tooltip: "Selecciona la empresa a la que pertenece la factura.",
            tooltipReview: "Esta es la empresa a la que pertenece la factura.",
        },
        reference: {
            label: "Referencia: *",
            placeholder: "Selecciona una referencia",
            placeholderEmpty: "No hay referencias disponibles",
            helperText: "Por favor selecciona una referencia.",
            tooltip: "Selecciona una referencia para la factura.",
            tooltipReview: "Esta es la referencia asociada a la factura.",
            withOutReferenceOption: "Sin referencia.",
            checkboxLabel: "Mostrar todas",
            referenceWarning: "La referencia ya esta facturada"
        },
        areas: {
            label: "Área: *",
            placeholder: "Selecciona una área",
            placeholderEmpty: "No hay áreas disponibles.",
            helperText: "Por favor selecciona una área.",
            tooltip: "Selecciona una área para la factura.",
            tooltipReview: "Esta es el área a la que va dirigida la factura.",
        },
        CeCo: {
            title: "Referencia:",
            concept: {
                label: "Concepto/gasto:",
                placeholder: "Concepto/gasto",
                tooltip: "Concepto de gasto de la referencia."
            },
            cost_profit_center: {
                label: "Centros costo:",
                placeholder: "Centros costo",
                tooltip: "Centros de costo de la referencia."
            },
            amount: {
                label: "Monto:",
                placeholder: "Monto",
                tooltip: "Monto de la referencia."
            },
        },
        xml_file: {
            label: "XML: *",
            tooltip: "Archivo XML de la factura."
        },
        xml_errors: {
            label: "Errores del XML:",
            tooltip: "Errores del archivo XML de la factura."
        },
        xml_warnings: {
            label: "Observaciones del XML:",
            tooltip: "Observaciones del archivo XML de la factura."
        },
        serie: {
            label: "Serie:",
            placeholder: "Ingresa la serie",
            helperText: "Por favor ingresa la serie.",
            tooltip: "Ingresa la serie de la factura, si aplica.",
            tooltipReview: "Esta es la serie asociada a la factura.",
        },
        folio: {
            label: "Folio: *",
            placeholder: "Ingresa el folio",
            helperText: "Por favor ingresa el folio.",
            tooltip: "Ingresa el folio de la factura.",
            tooltipReview: "Este es el folio asociado a la factura.",
        },
        xml_date: {
            label: "Fecha emisión: *",
            placeholder: "Selecciona una fecha",
            helperText: "Por favor selecciona una fecha.",
            tooltip: "Selecciona la fecha de emisión de la factura.",
            tooltipReview: "Esta es la fecha de emisión asociada a la factura.",
        },
        payment_method: {
            label: "Método pago:",
            placeholder: "ingresa método de pago",
            helperText: "Por favor selecciona un método de pago.",
            tooltip: "Selecciona el método de pago de la factura.",
            tooltipReview: "Este es el método de pago asociado a la factura.",
        },
        rfc_issuer: {
            label: "RFC emisor: *",
            placeholder: "ingresa RFC emisor",
            helperText: "Por favor ingresa el RFC del emisor.",
            tooltip: "Ingresa el RFC del emisor de la factura.",
            tooltipReview: "Este es el RFC del emisor de la factura.",
        },
        tax_regime_issuer: {
            label: "Régimen fiscal emisor:",
            placeholder: "ingresa régimen fiscal emisor",
            helperText: "Por favor ingresa el régimen fiscal del emisor.",
            tooltip: "Ingresa el régimen fiscal del emisor de la factura.",
            tooltipReview: "Este es el régimen fiscal del emisor de la factura."
        },
        rfc_receiver: {
            label: "RFC receptor: *",
            placeholder: "ingresa RFC receptor",
            helperText: "Por favor ingresa el RFC del receptor.",
            tooltip: "Ingresa el RFC del receptor de la factura.",
            tooltipReview: "Este es el RFC del receptor de la factura.",
        },
        tax_regime_receiver: {
            label: "Régimen fiscal receptor: *",
            placeholder: "ingresa régimen fiscal receptor",
            helperText: "Por favor ingresa el régimen fiscal del receptor.",
            tooltip: "Ingresa el régimen fiscal del receptor de la factura.",
            tooltipReview: "Este es el régimen fiscal del receptor de la factura.",
        },
        use_cfdi: {
            label: "Uso CFDI:",
            placeholder: "ingresa uso CFDI",
            helperText: "Por favor ingresa el uso CFDI.",
            tooltip: "Ingresa el uso CFDI de la factura.",
            tooltipReview: "Este es el uso CFDI de la factura.",
        },
        currency: {
            label: "Moneda: *",
            placeholder: "ingresa moneda",
            helperText: "Por favor ingresa la moneda.",
            tooltip: "Ingresa la moneda de la factura.",
            tooltipReview: "Esta es la moneda de la factura.",
        },
        exchange_rate: {
            label: "Tipo cambio:",
            placeholder: "ingresa tipo de cambio",
            helperText: "Por favor ingresa el tipo de cambio.",
            tooltip: "Ingresa el tipo de cambio de la factura.",
            tooltipReview: "Este es el tipo de cambio de la factura.",
        },
        amount: {
            label: "Monto: *",
            placeholder: "ingresa monto",
            helperText: "Por favor ingresa el monto.",
            tooltip: "Ingresa el monto de la factura.",
            tooltipReview: "Este es el monto de la factura.",
        },
        payDay: {
            label: "Fecha de pago:",
            placeholder: "Selecciona una fecha",
            helperText: "Por favor selecciona una fecha de pago.",
            tooltip: "Selecciona la fecha de pago de la factura solicitada por el comprador.",
            tooltipReview: "Esta es la fecha de pago solicitada por el comprador de la factura.",
        },
        edit_payDay: {
            label: "Editar fecha pago:",
        },
        notes_manual_payment_date: {
            label: 'Comentarios cambio de fecha de pago',
            tooltip: 'Ingresa los comentarios del motivo del cambio de fecha de pago',
            helperText: 'Ingresa comentario de cambio de fecha'
        },
        percentOption: {
            label: "% de pago:",
            placeholder: "Selecciona porcentaje de pago",
            helperText: "Por favor selecciona una opción.",
            tooltip: "Selecciona el porcentaje de pago de la factura.",
            tooltipReview: "Este es el porcentaje de pago de la factura.",
        },
        amountOption: {
            label: "Monto pago:",
            placeholder: "Monto de pago",
            helperText: "Por favor ingresa el monto de pago.",
            tooltip: "Ingresa el monto de pago de la factura.",
            tooltipReview: "Este es el monto de pago de la factura.",
        },
        aceptNotes: {
            label: "Descripción de la factura:",
            placeholder: "Ej: Servicio de consultoría",
            helperText: "Describe el concepto o servicio por el que se emite esta factura.",
            tooltip: "Breve descripción que identifique el propósito de la factura.",
            tooltipReview: "Descripción de la factura ingresada por el usuario.",
        },
        paymentInstruction: {
            label: "Instrucciones de pago:",
            placeholder: "Ej: Pagar en dolares",
            helperText: "Indica los métodos y detalles específicos para realizar el pago.",
            tooltip: "Pasos, métodos o información clave que se deben seguir para pagar.",
            tooltipReview: "Instrucciones de pago proporcionadas para el cliente.",
        },
        is_payment_loc: {
            label: "Pagar en pesos mexicanos"
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
            getCurrenciesError: "Error al obtener tipos de cambio."
        },
        rejectComments: {
            label: "Comentarios aprobación/rechazo:",
            placeholder: "Ingresa los comentarios.",
            helperText: "Por favor ingresa los comentarios de rechazo. Luego vuelve a presionar el botón de rechazar.",
            tooltip: "Ingresa los comentarios de rechazo si la factura es rechazada. Luego vuelve a presionar el botón de rechazar.",
            tooltipReview: "Estos son los comentarios de aprobación/rechazo de la factura.",
        },
        week: {
            label: "Sem.:",
            placeholder: "Sem.",
            tooltip: "Número de semana de la factura.",
        },
        is_advance: {
            label: "Es anticipo",
            tooltip: "Indica si la factura es un anticipo.",
        },
        advance_application: {
            label: "Aplicación anticipo",
            tooltip: "Indica como vas a aplicar tu anticipo"
        }
    },
    errors: {
        getInvoicesError: "Error al obtener las facturas. Por favor, intenta nuevamente más tarde.",
        getReferencesError: "Error al obtener las referencias. Por favor, intenta nuevamente más tarde.",
        downloadFilesError: "Error al descargar los archivos. Por favor, intenta nuevamente más tarde.",
        getFunctionalAreasError: "Error al obtener las áreas funcionales. Por favor, intenta nuevamente más tarde.",
        getPartnersError: "Error al obtener los proveedores. Por favor, intenta nuevamente más tarde.", 
        getCompaniesError: "Error al obtener las empresas. Por favor, intenta nuevamente más tarde.",
        getUrlsFilesError: "Error al obtener los archivos de la factura.",
        getAreasError: "Error al obtener las áreas funcionales. Por favor, intenta nuevamente más tarde.",
        getPaymentMethodsError: "Error al obtener los métodos de pago. Por favor, intenta nuevamente más tarde.",
        getUseCfdiError: "Error al obtener los usos de CFDI. Por favor, intenta nuevamente más tarde.",
    },
    btnDownloadFiles: "Descargar archivos",
    dpsDateLimitText: "Fecha límite de carga de facturas:",
    dpsDateAfterLimitText: "La fecha límite para cargar facturas fue.",
    viewInstructions: {
        downloadFiles: {
            header: "Descargar archivos de una factura:",
            step1: "Presiona el botón de descarga en la columna 'Archivos' de la factura que deseas descargar.",
            step2: "Se descargará un archivo ZIP que contiene los archivos PDF y XML de la factura.",
        },
        reviewInvoice: {
            header: "Revisar una factura:",
            step1: "Presiona dos veces sobre la fila de la factura que deseas revisar.",
            step2: "Al presionar dos veces, se abrirá un cuadro de diálogo, el cual contiene más instrucciones para revisar la factura.",
        },
        uploadInvoice: {
            header: "Cargar una nueva factura:",
            step1: "Presiona el botón 'Cargar factura'",
            step2: "Al presionar el botón, se abrirá un cuadro de diálogo, el cual contiene más instrucciones para cargar una nueva factura.",
        },
        searchInvoices: {
            header: "Buscar facturas:",
            step1: "Utiliza el campo 'Buscar' para filtrar las facturas por cualquier campo visible en la tabla.",
            step2: "Escribe el texto que deseas buscar y la tabla se actualizará automáticamente para mostrar solo las facturas que coincidan con el texto ingresado.",
            step3: "Presiona el botón 'Limpiar filtros' para limpiar todos los filtros aplicados y mostrar todas las facturas nuevamente."
        },
        shortColumn: {
            header: "Ordenar por columna:",
            step1: "Presiona el encabezado de cualquier columna para ordenar las facturas por esa columna en orden ascendente o descendente.",
            step2: "Un ícono de flecha junto al encabezado de la columna indica el orden actual (ascendente o descendente).",
        },
        reloadView: {
            header: "Recargar vista:",
            step1: "Presiona el botón de 'Recargar' para actualizar la vista y cargar los datos más recientes.",
        }
    },
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
        currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros",
        emptyMessage: "Sin datos para mostrar.",   
    },
    helpText: {
        buttonLabel: "Videos de ayuda",
        buttonTooltip: "Ver tutorial de inicio de sesión",
        dialogHeader: "Manual de Usuario",
    }
}

export default invoices;