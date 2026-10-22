import footer from "../footer/footer";

const partners = {
    titleNewProvider: "Solicitudes de alta nuevas",
    titleNewProviderTooltip: "Pantalla para consultar las solicitudes de alta de proveedores nuevas y revisarlas.",
    titleAccepted: "Solicitudes de alta revisadas",
    titleAcceptedTooltip: "Pantalla para consultar las solicitudes de alta revisadas.",
    titleRejected: "Solicitudes de alta rechazadas en la revisión",
    titleRejectedTooltip: "Pantalla para consultar las solicitudes de alta rechazadas en la revisión.",
    titleInProcess: "Solicitudes de alta en autorización",
    titleInProcessTooltip: "Pantalla para consultar las solicitudes de alta en proceso de autorización.",
    titleAuthorized: "Solicitudes de alta autorizadas",
    titleAuthorizedTooltip: "Pantalla para consultar las solicitudes de alta autorizadas.",
    titleRejectedAuth: "Solicitudes de alta rechazadas en la autorización",
    titleRejectedAuthTooltip: "Pantalla para consultar las solicitudes de alta rechazadas durante la autorización.",
    titleMyAuth: "Autorizaciones de solicitudes de alta pendientes para mí",
    titleMyAuthTooltip: "Pantalla para consultar las solicitudes de alta pendientes de mi autorización.",
    titleAllRequestPartner: "Todas las solicitudes de proveedor",
    titleAllRequestPartnerTooltip: "Pantalla para consultar todas las solicitudes de proveedor.",

    viewInstructions: {
        reviewPartner: {
            header: "Revisar un proveedor:",
            step1: "Haga doble clic en la fila del proveedor que desea revisar.",
            step2: "Se abrirá un cuadro de diálogo con la información y las opciones disponibles para revisar el proveedor."
        },
        searchPartner: {
            header: "Buscar proveedores:",
            step1: "Utilice el campo 'Buscar' para localizar proveedores por la información disponible en la tabla.",
            step2: "Escriba el texto que desea buscar. La tabla se actualizará automáticamente para mostrar los proveedores que coincidan con la búsqueda.",
            step3: "Presione el botón 'Limpiar filtros' para borrar el texto ingresado en el campo 'Buscar'."
        },
        sortColumn: {
            header: "Ordenar por columna:",
            step1: "Haga clic en el encabezado de una columna para ordenar los proveedores de forma ascendente o descendente.",
            step2: "El ícono de flecha junto al encabezado de la columna indica el orden aplicado.",
        },
        reloadView: {
            header: "Actualizar vista:",
            step1: "Presione el botón 'Recargar' para actualizar la vista y consultar la información más reciente."
        },
        sendToAuthPartner: {
            header: "Enviar a autorizar un proveedor:",
            step1: "Haga doble clic en la fila del proveedor que desea mandar a autorizar.",
            step2: "Se abrirá un cuadro de diálogo con la información y las opciones disponibles para enviar a autorizar el proveedor."
        },
        authPartner: {
            header: "Autorizar un proveedor:",
            step1: "Haga doble clic en la fila del proveedor que desea autorizar.",
            step2: "Se abrirá un cuadro de diálogo con la información y las opciones disponibles para autorizar el proveedor."
        },
        authPartnerInMonitor: {
            header: "Autorizar un proveedor:",
            step1: "Diríjase a la vista de 'Pendientes para mí' en la pestaña de 'Autorizar solicitudes'.",
            step2: "Haga doble clic en la fila del proveedor que desea autorizar.",
            step3: "Se abrirá un cuadro de diálogo con la información y las opciones disponibles para autorizar el proveedor.",
            footer: "Estas mismas instrucciones están disponibles en la vista 'Pendientes para mí'."
        },
        downloadFiles: {
            header: "Descargar archivos de un proveedor:",
            step1: "Presione el botón de descarga en la columna 'Archivos' del proveedor que desea descargar.",
            step2: "Se descargará un archivo ZIP con los archivos asociados al proveedor, como el PDF y el XML cuando estén disponibles."
        },
        
    },
    confirmations: {
        deleteSupplier: {
            message: '¿Deseas eliminar el proveedor "{{providerName}}"?',
            header: "Confirmar eliminación"
        },
        deleteZone: {
            message: '¿Deseas eliminar la zona "{{zoneName}}"?',
            header: "Confirmar eliminación"
        }
    },
    register: {
        title: "Solicitud de alta de nuevo proveedor",
        reviewTitle: "Revisión registro de proveedor",
        sendToAuthTitle: "Enviar a autorizar registro de proveedor",
        updateTitle: "Actualización de solicitud de alta de proveedor",
        authTitle: "Autorización de solicitud de alta de proveedor",
        
        howToAuthorize: "¿Cómo autorizar un proveedor?",
        howToReview: "¿Cómo revisar un proveedor?",
        howToSendTo: "¿Cómo enviar a autorizar un proveedor?",
        importantNote: "Antes de comenzar, asegúrese de saber a cuál empresa y área funcional debe dirigir esta solicitud.",
        successMessage: "Registro de proveedor enviado a autorizar",
        
        reviewInstructions: {
            header: "Revisar un proveedor:",
            step1: "En la parte inferior del diálogo, presione el botón 'Mostrar archivos' para consultar los archivos del proveedor.",
            step2: "Para aceptar al proveedor, presione el botón 'Aceptar'. El proveedor pasará a la sección 'Aceptados', donde podrá enviarlo a autorización. Si lo prefiere, presione el botón 'Aceptar y enviar' para aceptarlo y enviarlo directamente a autorización.",
            step3: "Para rechazar al proveedor, ingrese un comentario con el motivo del rechazo y presione el botón 'Rechazar'."
        },
        sendAuthInstructions: {
            header: "Enviar a autorización:",
            step1: "En la parte inferior del diálogo, presione el botón 'Mostrar archivos' para consultar los archivos del proveedor.",
            step2: "Presione el botón 'Enviar a autorizar' para enviar el proveedor a autorización."
        },
        authInstructions: {
            header: "Autorizar un proveedor:",
            step1: "En la parte inferior del diálogo, presione el botón 'Mostrar archivos' para consultar los archivos del proveedor.",
            step2: "Si la solicitud es correcta, presione el botón 'Autorizar'.",
            step3: "Si la solicitud es incorrecta, presione el botón Rechazar para abrir el campo de comentarios de rechazo.",
            step4: "Ingrese los comentarios de rechazo y vuelva a presionar el botón Rechazar.",
            footer: "Asegúrese de que los comentarios sean claros y específicos para que el proveedor pueda corregir la solicitud."
        },
        
        titleproviderCompany: {
            label: "Empresa y área funcional a proveer inicialmente",
            tooltip: "Empresa y área funcional a las que se dirigirá inicialmente esta solicitud."
        },
        titleProviderData: {
            label: "Datos del proveedor",
            tooltip: "Información del proveedor de conformidad con la Constancia de Situación Fiscal (CSF) o documento equivalente."
        },
        titleProviderContact: {
            label: "Datos de contacto del proveedor",
            tooltip: "Información de la persona que será el contacto principal con el proveedor."
        },
        titleProviderLocation: {
            label: "Domicilio del proveedor",
            tooltip: "Domicilio del proveedor de conformidad con la Constancia de Situación Fiscal (CSF) o documento equivalente."
        },
        provider_name: {
            label: "Razón social o nombre del proveedor:",
            tooltip: "Razón social de la organización o nombre(s) y apellido(s) del proveedor.",
            placeholder: "",
            textHelper: "Ingrese la razón social o nombre del proveedor."
        },
        rfc: {
            label: "RFC o ID fiscal del proveedor:",
            tooltip: "Clave del Registro Federal de Contribuyentes o ID fiscal en el país de origen del proveedor.",
            placeholder: "",
            textHelper: "Ingrese el RFC o ID fiscal del proveedor."
        },
        entity_type: {
            label: "Tipo de entidad del proveedor:",
            tooltip: "Personalidad jurídica del proveedor: “Organización” (persona moral) o “Persona” (persona física).",
            placeholder: "",
            textHelper: "Seleccione el tipo de entidad del proveedor."
        },
        fiscal_regime: {
            label: "Régimen fiscal del proveedor:",
            tooltip: "Régimen fiscal del proveedor (616 si es extranjero).",
            placeholder: "",
            textHelper: "Ingrese el régimen fiscal del proveedor."
        },
        company: {
            label: "Empresa:",
            tooltip: "Empresa a la que se pretende suministrar inicialmente bienes o servicios.",
            placeholder: "",
            textHelper: "Seleccione la empresa a proveer."
        },
        area: {
            label: "Área funcional:",
            tooltip: "Área funcional a la que se pretende suministrar inicialmente bienes o servicios.",
            placeholder: "",
            textHelper: "Seleccione el área funcional a proveer."
        },
        name: {
            label: "Nombre(s):",
            tooltip: "Nombre o nombres del contacto.",
            placeholder: "",
            textHelper: "Ingrese el nombre o nombres."
        },
        last_name: {
            label: "Apellido(s):",
            tooltip: "Apellido o apellidos del contacto.",
            placeholder: "",
            textHelper: "Ingrese el apellido o apellidos."
        },
        phone: {
            label: "Teléfono:",
            tooltip: "Teléfono del contacto, incluyendo códigos de área y país, si aplica.",
            placeholder: "",
            textHelper: "Ingrese el teléfono."
        },
        email: {
            label: "Correo-e:",
            tooltip: "Buzón de correo-e del contacto.",
            placeholder: "",
            textHelper: "Ingrese el correo-e."
        },
        street: {
            label: "Calle:",
            tooltip: "Nombre de la vialidad del domicilio del proveedor.",
            placeholder: "",
            textHelper: "Ingrese la calle."
        },
        number: {
            label: "Número:",
            tooltip: "Número exterior e interior, si aplica, del domicilio del proveedor.",
            placeholder: "",
            textHelper: "Ingrese el número."
        },
        country: {
            label: "País:",
            tooltip: "País de origen y del domicilio del proveedor.",
            placeholder: "",
            textHelper: "Seleccione el país."
        },
        state: {
            label: "Estado:",
            tooltip: "Nombre del estado, provincia o territorio del domicilio del proveedor.",
            placeholder: "",
            textHelper: "Seleccione el estado."
        },
        city: {
            label: "Ciudad:",
            tooltip: "Nombre de la localidad del domicilio del proveedor.",
            placeholder: "",
            textHelper: "Ingrese la ciudad."
        },
        postal_code: {
            label: "Código postal:",
            tooltip: "Código postal del domicilio del proveedor.",
            placeholder: "",
            textHelper: "Ingrese el código postal."
        },
        compliance: {
            title: "Documentación de cumplimiento legal",
            tooltip: "Deposite los archivos requeridos. El peso total de los archivos no debe exceder 40 MB.",
            optionalBadge: "Opcional",
            maxWeight: "Peso máximo"
        },
        alerts: {
            unitSizeTitle: "Archivo muy pesado:",
            fileSizeDetail: "El archivo \"{{name}}\" pesa {{size}}, superando el límite máximo por archivo ({{limit}}).",
            imageSizeDetail: "El archivo \"{{name}}\" pesa {{size}}, superando el límite máximo por archivo ({{limit}}).",
            totalSizeTitle: "Bandeja llena:",
            totalSizeDetail: "No se puede adjuntar \"{{name}}\". El total de los documentos superaría el límite de 40 MB.",
            invalidFileType: "Solo se permiten archivos \"{{extensions}}\".",
            formIncompleteTitle: "Formulario incompleto:",
            formIncompleteDetail: "Complete todos los campos marcados en rojo del formulario.",
            expediteIncompleteTitle: "Expediente incompleto:",
            expediteIncompleteDetail: "Faltan documentos obligatorios por adjuntar en las casillas marcadas con asterisco."
        },
        authz_acceptance_notes: {
            label: "Notas de aceptación/rechazo:",
            tooltip: "Notas registradas durante la aceptación o rechazo de la solicitud.",
            placeholder: "",
            textHelper: "Ingrese las notas de aceptación o rechazo."
        },
        authz_authorization_notes: {
            label: "Notas de autorización/rechazo:",
            tooltip: "Notas registradas durante la autorización o rechazo de la solicitud.",
            placeholder: "",
            textHelper: "Ingrese las notas de autorización o rechazo."
        },
        files: {
            label: "Archivos a cargar:",
            labelListFiles: "Archivos del expediente del proveedor",
            labelRequestFiles: "Cargue los siguientes archivos:",
            labelAdditionalFiles: "Archivos adicionales",
            labelKeepFiles: "Seleccione los archivos que desea conservar",
            buttonLabelKeepFiles: "Archivo anterior conservado",
            tooltip: "Archivos que forman parte del expediente del proveedor.",
            tooltipListFiles: "Archivos necesarios para verificar la información e integrar el expediente del proveedor.",
            tooltipKeepFiles: "Estos archivos se cargaron en su solicitud anterior. Seleccione los que desee conservar en su solicitud actual.",
            placeholder: "",
            textHelper: ""
        },
        listFiles: {
            file1: {
                name: "Opinión del Cumplimiento de Obligaciones Fiscales",
                description: "Documento reciente (máximo 1 mes) emitido por la autoridad fiscal donde se indica si está al corriente de sus obligaciones. En México, puede obtenerlo desde su buzón tributario del SAT.",
                descriptionSummary: "Documento reciente (máximo 1 mes)."
            },
            file2: {
                name: "Constancia de Situación Fiscal (CSF)",
                description: "Documento reciente (máximo 1 mes) emitido por la autoridad fiscal donde se muestra su razón social o nombre, RFC o ID fiscal, domicilio y régimen fiscal. En México, puede obtenerlo desde su buzón tributario del SAT.",
                descriptionSummary: "Documento reciente (máximo 1 mes)."
            },
            file3: {
                name: "Comprobante de domicilio",
                description: "Cargue un recibo de servicios reciente (máximo 3 meses) donde se muestre su razón social o nombre y domicilio fiscal. Puede ser de electricidad, agua, gas, teléfono o un estado de cuenta bancario.",
                descriptionSummary: "Documento reciente (máximo 3 meses)."
            },
            file4: {
                name: "Carátula del estado de cuenta bancario",
                description: "Cargue la carátula del estado de cuenta bancario de la cuenta en la que desea recibir sus pagos, con una antigüedad máxima de 3 meses. Solo se necesita la parte donde aparecen el nombre de la institución financiera, su razón social o nombre, número de cuenta bancaria, Clave Bancaria Estandarizada (CLABE) y moneda. Omita saldos y movimientos.",
                descriptionSummary: "Documento reciente (máximo 3 meses)."
            },
            file5: {
                name: "Carta de confirmación de datos proporcionados",
                description: "Documento en formato libre, firmado de manera autógrafa, donde confirma que la información proporcionada es correcta, verídica y está actualizada.",
                descriptionSummary: "Formato libre, con firma autógrafa."
            }
        },
        extraFiles: {
            label: "Archivos adicionales:",
            tooltip: "Puede adjuntar archivos adicionales, siempre que el tamaño total no supere el límite establecido.",
            placeholder: "Arrastre aquí actas, identificaciones u otros documentos complementarios."
        },
        success: {
            title: "Solicitud enviada",
            text: "Su solicitud ha sido procesada con éxito. Espere a recibir una notificación cuando su cuenta sea aceptada.",
            buttonLabel: "Ir a login"
        },
        fail: {
            send: "Error al enviar el registro.",
            review: "Error al aceptar el registro de proveedor.",
            fiscalRegime: "Error al obtener los regímenes fiscales:",
            companies: "Error al obtener las empresas",
            areas: "Error al obtener las áreas",
            countries: "Error al obtener los países"
        },
        updated: {
            title: "Solicitud actualizada y enviada",
            text: "Su solicitud ha sido actualizada con éxito. Espere a recibir una notificación cuando su cuenta sea aceptada."
        }
    }
}

export default partners;