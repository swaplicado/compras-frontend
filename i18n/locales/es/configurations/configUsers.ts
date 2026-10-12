const configUsers = {
    title: "Configuración de usuarios",
    titleTooltip: "Configuración de carga de facturas sin referencia y carga masiva de facturas",
    options: {
        withoutRef: "Sin referencia",
        bulkUpload: "Carga masiva",
        partnersVsAreas: "Proveedores vs áreas",
    },
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
            full_name: "Proveedor",
            areas: "Áreas asignadas",
            edit: ""
        }
    },
    dialogPartnerAreas: {
        sourceAreas: "Áreas para escoger",
        targetAreas: "Áreas asignadas"
    },
    responses: {
        success: "Permiso actualizado correctamente",
        successPartnerAreas: "Áreas asignadas correctamente",
        errorGetUsers: "Error al obtener los usuarios",
        errorGetPartners: "Error al obtener los proveedores",
        errorUpdateUserPermission: "Error al actualizar el permiso del usuario",
        errorUpdateProcessingType: "Error al actualizar el tipo de proceso del proveedor",
        errorAssignPartnerAreas: "Error al asignar áreas al proveedor"
    }
};

export default configUsers;