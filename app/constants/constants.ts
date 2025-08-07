export default {
    // Rutas para la api de axios
    API_AXIOS_POST: '/api/axios/post',
    API_AXIOS_GET: '/api/axios/get',
    API_AXIOS_PATCH: '/api/axios/patch',

    //timeout para las peticiones axios (de momento no se usa)
    TIMEOUT: 5000,

    //Array de ids de roles
    ROLES: {
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
    }
}