export default {
    API_AXIOS_POST: '/api/axios/post',
    API_AXIOS_GET: '/api/axios/get',
    API_AXIOS_PATCH: '/api/axios/patch',
    TIMEOUT: 5000,
    ITEMS_PER_PAGE: 20,
    ROLES: {
        COMPRADOR_ID: 1,
        CONTADOR_ID: 2,
        PAGADOR_ID: 3,
        PROVEEDOR_ID: 4,
    },
    ROUTE_GET_DPS_BY_PARTNER_ID : '/transactions/documents/list-doc-by-partner/',
    ROUTE_GET_DPS_BY_AREA_ID: '/transactions/documents/list-doc-by-functional-area/',

    REVIEW_ACCEPT: 'A',
    REVIEW_REJECT: 'R',
    REVIEW_PENDING: 'P',

    TABLE_ROWS: [10, 25, 50],
    TABLE_DEFAULT_ROWS: 10,
}