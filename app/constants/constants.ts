const constants = {
    // Rutas para la api de axios
    API_AXIOS_POST: '/api/axios/post',
    API_AXIOS_GET: '/api/axios/get',
    API_AXIOS_PATCH: '/api/axios/patch',

    //timeout para las peticiones axios (de momento no se usa)
    TIMEOUT: 5000,

    //Array de ids de roles
    ROLES: {
        ADMINISTRADOR_ID: 1,
        COMPRADOR_ID: 1,
        CONTADOR_ID: 2,
        PAGADOR_ID: 3,
        PROVEEDOR_ID: 4,
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

    ROUTE_POST_VALIDATE_XML: '/transactions/documents/validate-xml/',
    ROUTE_POST_DOCUMENT_TRANSACTION: '/transactions/document-transaction/',

    //Constantes de estados de las facturas
    REVIEW_ACCEPT: 'A',
    REVIEW_REJECT: 'R',
    REVIEW_PENDING: 'P',

    //Constantes de datatables
    TABLE_ROWS: [10, 25, 50],
    TABLE_DEFAULT_ROWS: 10,

    //pais id
    COUNTRIES: {
        MEXICO_ID: 150
    },

    //Constantes para los archivos
    maxFilesSize: 20 * 1024 * 1024, // 20 MB
    maxFileSizeForHuman: '20 MB',
    allowedExtensions: ['application/pdf', 'text/xml', 'image/png', 'image/jpeg'],
    allowedExtensionsNames: 'application/pdf, text/xml, image/png, image/jpeg',
    
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
    DOC_TYPE_INVOICE: 11,
    DOC_TYPE_OC: 2,

    //Clase de transacciòn
    TRANSACTION_CLASS_COMPRAS: 1,
    TRANSACTION_CLASS_VENTAS: 2,

    //Tipo de entidad
    ENTITY_TYPE_PERSON: 1,
    ENTITY_TYPE_ORGANITATION: 2,
}

export default constants;