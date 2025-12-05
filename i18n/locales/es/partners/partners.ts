const partners = {
    titleNewProvider: "Solicitudes de alta nuevas",
    titleAccepted: "Solicitudes de alta revisadas",
    titleRejected: "Solicitudes de alta rechazadas en la revisión",
    titleInProcess: "Solicitudes de alta en autorización",
    titleAuthorized: "Solicitudes de alta autorizadas",
    titleRejectedAuth: "Solicitudes de alta rechazadas en la autorización",
    titleMyAuth: "Autorizaciones de solicitudes de alta pendientes para mí",
    reviewInstructions: {
        header: "Para revisar un proveedor sigue estos pasos:",
        step1: "Identifica el renglón del proveedor que deseas revisar.",
        step2: "Haz doble clic sobre el renglón del proveedor correspondiente, se abrirá un diálogo con la información del proveedor.",
        step3: "En la parte inferior del diálogo se encuentra un botón Mostrar archivos, presiona este botón para ver los archivos del proveedor.",
        step4: `Para aceptar al proveedor solo presiona el botón Aceptar y pasará a la sección del menu Aceptados donde tendras que enviarlo a autorización 
                ó si lo prefieres puedes aceptar y enviar a autorizar presionando el boton Aceptar y enviar, y pasara a estar en autorización.`,
        step5: "Para rechazar al proveedor debes ingresar un comentario con el motivo del rechazo, luego presiona el botón Rechazar."
    },
    sendAuthInstructions: {
        header: "Para enviar a autorizar:",
        step1: "Identifica el renglón del proveedor que deseas enviar a autorizar.",
        step2: "Haz doble clic sobre el renglón del proveedor correspondiente, se abrirá un diálogo con la información del proveedor.",
        step3: `Para enviar a autorizar al proveedor solo presiona el botón Enviar a autorizar.`,
    },
    authInstructions: {
        header: "Para autorizar un proveedor sigue estos pasos:",
        step1: "Identifica el renglón del proveedor que deseas autorizar.",
        step2: "Haz doble clic sobre el renglón del proveedor correspondiente, se abrirá un diálogo con la información del proveedor.",
        step3: "En la parte inferior del diálogo se encuentra un botón Mostrar archivos, presiona este botón para ver los archivos del proveedor.",
        step4: "Para autorizar al proveedor solo presiona el botón Autorizar.",
        step5: "Para rechazar al proveedor debes ingresar un comentario con el motivo del rechazo, luego presiona el botón Rechazar."
    },
    register: {
        titleProviderData: {
            label: "Datos del proveedor",
            tooltip: "De conformidad con la Constancia de Situación Fiscal (CSF) o documento equivalente"
        },
        titleProviderContact: {
            label: "Datos de contacto del proveedor",
            tooltip: "Persona quien será el contacto principal con el proveedor"
        },
        titleProviderLocation: {
            label: "Domicilio del proveedor",
            tooltip: "De conformidad con la Constancia de Situación Fiscal (CSF) o documento equivalente"
        },
        provider_name: {
            label: "Razón social o nombre del proveedor",
            tooltip: "Razón social de la organización o nombre(s) y apellido(s) del proveedor",
            placeholder: "",
            textHelper: "Ingresa razón social o nombre del proveedor"
        },
        rfc: {
            label: "RFC o ID fiscal del proveedor",
            tooltip: "Clave del Registro Federal de Contribuyentes o ID fiscal en el país de origen del proveedor",
            placeholder: "",
            textHelper: "Ingresa RFC o ID fiscal del proveedor"
        },
        entity_type: {
            label: "Tipo de entidad del proveedor",
            tooltip: "Personalidad jurídica del proveedor: “Organización” (persona moral) o “Persona” (persona física)",
            placeholder: "",
            textHelper: "Selecciona tipo de entidad del proveedor"
        },
        fiscal_regime: {
            label: "Régimen fiscal del proveedor",
            tooltip: "Régimen fiscal del proveedor (616 si eres extranjero)",
            placeholder: "",
            textHelper: "Ingresa régimen fiscal del proveedor"
        },
        company: {
            label: "Empresa a proveer",
            tooltip: "Empresa a la que se pretende suministrar inicialmente bienes o servicios",
            placeholder: "",
            textHelper: "Ingresa la empresa a proveer"
        },
        area: {
            label: "Área funcional a proveer",
            tooltip: "Área funcional de la empresa a la que se pretende inicialmente suministrar bienes o servicios",
            placeholder: "",
            textHelper: "Ingresa área funcional a proveer"
        },
        name: {
            label: "Nombre(s)",
            tooltip: "Nombre o nombres del contacto",
            placeholder: "",
            textHelper: "Ingresa nombre(s)"
        },
        last_name: {
            label: "Apellido(s)",
            tooltip: "Apellido o apellidos del contacto",
            placeholder: "",
            textHelper: "Ingresas apellido(s)"
        },
        phone: {
            label: "Teléfono",
            tooltip: "Teléfono del contacto, incluyendo códigos de área y país (si aplica)",
            placeholder: "",
            textHelper: "Ingresa teléfono"
        },
        email: {
            label: "Correo-e",
            tooltip: "Buzón de correo-e del contacto",
            placeholder: "",
            textHelper: "Ingresa correo-e"
        },
        street: {
            label: "Calle",
            tooltip: "Nombre de la vialidad del domicilio del proveedor",
            placeholder: "",
            textHelper: "Ingresa calle"
        },
        number: {
            label: "Número",
            tooltip: "Número exterior e interior (si aplica) del domicilio del proveedor",
            placeholder: "",
            textHelper: "Ingresa número"
        },
        country: {
            label: "País",
            tooltip: "País de origen y del domicilio del proveedor",
            placeholder: "",
            textHelper: "Ingresa país"
        },
        state: {
            label: "Estado",
            tooltip: "Nombre del estado, provincia o territorio del domicilio del proveedor",
            placeholder: "",
            textHelper: "Ingresa estado"
        },
        city: {
            label: "Ciudad",
            tooltip: "Nombre de la localidad del domicilio del proveedor",
            placeholder: "",
            textHelper: "Ingresa ciudad"
        },
        postal_code: {
            label: "Código postal",
            tooltip: "Código postal del domicilio del proveedor",
            placeholder: "",
            textHelper: "Ingresa código postal"
        },
        authz_acceptance_notes: {
            label: "Notas aceptación/rechazo",
            tooltip: "Notas aceptación/rechazo",
            placeholder: "",
            textHelper: "Ingresa notas aceptación/rechazo"
        },
        authz_authorization_notes: {
            label: "Notas autorización/rechazo",
            tooltip: "Notas autorización/rechazo",
            placeholder: "",
            textHelper: "Ingresa notas autorización/rechazo"
        },
        files: {
            label: "Archivos a cargar",
            labelListFiles: "Archivos del expediente del proveedor",
            tooltip: "Archivos del expediente del proveedor",
            tooltipListFiles: "Archivos necesarios para verificar la información e integrar el expediente del proveedor",
            placeholder: "",
            textHelper: ""
        },
        listFiles: {
            file1: {
                name: 'Opinión del Cumplimiento de Obligaciones Fiscales',
                description: 'Documento reciente (máximo 1 mes) emitido por la autoridad fiscal donde se indica si estás al corriente de tus obligaciones. En México, puedes obtenerlo desde tu buzón tributario del SAT.'
            },
            file2: {
                name: 'Constancia de Situación Fiscal (CSF)',
                description: 'Documento reciente (máximo 1 mes) emitido por la autoridad fiscal donde se muestra tu razón social o nombre, RFC o ID fiscal, domicilio y régimen fiscal. En México, puedes obtenerlo desde tu buzón tributario del SAT.'
            },
            file3: {
                name: 'Comprobante de domicilio',
                description: 'Sube un recibo de servicios reciente (máximo 3 meses) donde se muestre tu razón social o nombre y domicilio fiscal. Puede ser de electricidad, agua, gas, teléfono o un estado de cuenta bancario.'
            },
            file4: {
                name: 'Carátula del estado de cuenta bancario',
                description: 'Sube la carátula del estado de cuenta bancario de la cuenta en la que deseas recibir tus pagos, que sea reciente (máximo 3 meses). Solo necesitamos la parte donde aparecen el nombre de la institución financiera, tu razón social o nombre, número de cuenta bancaria y Clave Bancaria Estándar (ClaBE) y moneda. Omite saldos y movimientos.'
            },
            file5: {
                name: 'Carta de confirmación de datos proporcionados',
                description: 'Es un documento en formato libre, firmado de manera autógrafa, donde confirmas que la información proporcionada es correcta, verídica y que está actualizada.'
            }
        }
    }
}

export default partners;