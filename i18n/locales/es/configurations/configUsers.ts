const configUsers = {
    title: "Configuración de usuarios",
    titleTooltip: "Configuración de carga de facturas sin referencia y carga masiva de facturas",
    tableUser: {
        columns: {
            username: "Usuario",
            full_name: "Nombre",
            email: "Email",
            has_invoice_without_oc_permission: "Captura sin referencia"
        }
    },
    tablePartners: {
        columns: {
            fiscal_id: "RFC",
            trade_name: "Proveedor",
            email: "Email",
            uploadFlete: "Carga masiva de fletes",
            uploadFruta: "Carga masiva de compras fruta"
        }
    },
    tablePartnersAreas: {
        columns: {
            full_name: "proveedor",
            areas: "Áreas asignadas",
            edit: ""
        }
    },
    dialogPartnerAreas: {
        sourceAreas: "Areas para escoger",
        targetAreas: "Áreas asignadas"
    }
}

export default configUsers;