const constants = {
    // Rutas para la api de axios
    API_AXIOS_POST: '/api/axios/post',
    API_AXIOS_GET: '/api/axios/get',
    API_AXIOS_PATCH: '/api/axios/patch',
    API_AXIOS_DELETE: '/api/axios/delete',

    //timeout para las peticiones axios (de momento no se usa)
    TIMEOUT: 5000,

    //Array de ids de roles
    ROLES: {
        ADMINISTRADOR_ID: 1,
        COMPRADOR_ID: 2,
        CONTADOR_ID: 3,
        PAGADOR_ID: 4,
        PROVEEDOR_ID: 5,
    },
    
    //Rutas de peticiones backend (transactions-backend, users-backend, compras-backend, etc.)
    ROUTE_GET_DPS_BY_PARTNER_ID : '/transactions/documents/list-doc-by-partner/',
    ROUTE_GET_DPS_BY_AREA_ID: '/transactions/documents/list-doc-by-functional-area/',
    ROUTE_DOWNLOAD_FILES_DPS: '/transactions/documents/download-zip/',
    ROUTE_GET_DPS_LIMIT_DATES: '/transactions/upload-deadline/check-deadline/',
    ROUTE_GET_COMPANIES: '/transactions/partners/list-companies/',
    ROUTE_GET_REFERENCES: '/transactions/references/by-partner/',
    ROUTE_GET_CURRENCIES: '/transactions/currencies/',
    ROUTE_GET_FISCAL_REGIMES: '/transactions/fiscal-regimes/',
    ROUTE_GET_URL_FILES_DPS: '/transactions/documents/signed-urls/',
    ROUTE_GET_PAYMENT_METHODS: '/transactions/payment-methods/',
    ROUTE_GET_USE_CFDI: '/transactions/cfdi-uses/',
    ROUTE_GET_AREAS: '/transactions/fuctional-area/by-user/',
    ROUTE_GET_FLOW_AUTHORIZATIONS: '/transactions/flow-models-by',
    ROUTE_GET_DPS_AUTHORIZATION: '/transactions/user-documents/',
    ROUTE_GET_PAYMENTS_BY_AREA_ID: '/transactions/payments/by-functional-area/',
    ROUTE_GET_PAYMENTS_BY_PARTNER_ID: '/transactions/payments/by-partner/',
    ROUTE_GET_DPS_AUTHORIZATIONS_BY_FUNCTIONAL_AREA: '/transactions/my-document-auth/',
    ROUTE_GET_LIST_DOC_FILES: '/transactions/documents/list-doc-files/',

    ROUTE_POST_VALIDATE_XML: '/transactions/documents/validate-xml/',
    ROUTE_POST_DOCUMENT_TRANSACTION: '/transactions/document-transaction/',
    ROUTE_POST_START_AUTHORIZATION: '/transactions/start-authorization/',

    ROUTE_POST_AUTHORIZE_RESOURCE: '/transactions/authorize-resource/',
    ROUTE_POST_REJECT_RESOURCE: '/transactions/reject-resource/',

    //Constantes de estados de las facturas
    REVIEW_ACCEPT: 'O',
    REVIEW_REJECT: 'R',
    REVIEW_PENDING: 'P',
    REVIEW_ACCEPT_ID: 9,
    REVIEW_REJECT_ID: 8,
    REVIEW_PROCESS_ID: 2,
    REVIEW_PENDING_ID: 1,
    

    //Constantes de datatables
    TABLE_ROWS: [10, 25, 50],
    TABLE_DEFAULT_ROWS: 10,

    //pais id
    COUNTRIES: {
        MEXICO_ID: 150
    },

    //monedas id
    CURRENCIES: {
        MXN: 102
    },

    //Constantes para los archivos
    maxFilesSize: 25 * 1024 * 1024, // 20 MB
    maxFileSizeForHuman: '25 MB',
    allowedExtensions: ['application/pdf', 'text/xml', 'image/png', 'image/jpeg', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    allowedExtensionsNames: 'application/pdf, text/xml, image/png, image/jpeg, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    maxUnitFile: 5 * 1024 * 1024,

    //catalogo de regimen fiscal
    CAT_FISCAL_REGIME: [
        { id: 'NA', name: '(No aplica)' },
        { id: 601, name: 'General de Ley Personas Morales' },
        { id: 603, name: 'Personas Morales con Fines no Lucrativos' },
        { id: 605, name: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
        { id: 606, name: 'Arrendamiento' },
        { id: 607, name: 'Régimen de Enajenación o Adquisición de Bienes' },
        { id: 608, name: 'Demás ingresos' },
        { id: 610, name: 'Residentes en el Extranjero sin Establecimiento Permanente en México' },
        { id: 611, name: 'Ingresos por Dividendos (socios y accionistas)' },
        { id: 612, name: 'Personas Físicas con Actividades Empresariales y Profesionales' },
        { id: 614, name: 'Ingresos por intereses' },
        { id: 615, name: 'Régimen de los ingresos por obtención de premios' },
        { id: 616, name: 'Sin obligaciones fiscales' },
        { id: 620, name: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
        { id: 621, name: 'Incorporación Fiscal' },
        { id: 622, name: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
        { id: 623, name: 'Opcional para Grupos de Sociedades' },
        { id: 624, name: 'Coordinados' },
        { id: 625, name: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
        { id: 626, name: 'Régimen Simplificado de Confianza' }
    ],

    //Tipo de documento
    DOC_TYPE_INVOICE: 41,
    DOC_TYPE_OC: 2,

    //Clase de transacciòn
    TRANSACTION_CLASS_COMPRAS: 1,
    TRANSACTION_CLASS_VENTAS: 2,

    //Tipo de entidad
    ENTITY_TYPE_PERSON: 1,
    ENTITY_TYPE_ORGANITATION: 2,

    //id de sistema externo
    ID_EXTERNAL_SYSTEM: 1,

    //id de modelo de flujo de autorizaciones
    ID_MODEL_TYPE_DPS: 1,

    //tipo de recurso en autorizaciones
    RESOURCE_TYPE_PUR_INVOICE: 4,
    RESOURCE_TYPE_PAYMENTS: 11,

    //estatus de pagos
    PAYMENT_STATUS_NEW_ID: 1,
    PAYMENT_STATUS_IN_AUTH_ID: 2,
    PAYMENT_STATUS_REJECTED_ID: 3,
    PAYMENT_STATUS_PROGRAMED_ID: 4,
    PAYMENT_STATUS_EXECUTED_ID: 5,
    PAYMENT_STATUS_NOTIFIED_ID: 6,
    PAYMENT_STATUS_COMP_ID: 7,
    PAYMENT_STATUS_CANCELED_ID: 9,
}

export default constants;