const orders = {
    title: "Órdenes de compra",
    uploadDialog: { 
        headerCreate: "Cargar orden de compra",
        headerReview: "Aceptar o rechazar orden de compra",
        
        provider: {
            label: "* Proveedor:",
            placeholder: "Selecciona un proveedor",
            helperText: "Por favor selecciona un proveedor.",
            tooltip: "Selecciona el proveedor asociado a la orden de compra.",
            tooltipReview: "Este es el proveedor asociado a la orden de compra.",
        },
        company:  {
            label: "* Entidad comercial:",
            placeholder: "Selecciona una empresa",
            helperText: "Por favor selecciona una empresa.",
            tooltip: "Selecciona la empresa a la que pertenece la orden de compra.",
            tooltipReview: "Esta es la empresa a la que pertenece la orden de compra.",
        },
        reference: {
            label: "* Referencia:",
            placeholder: "Selecciona una referencia",
            helperText: "Por favor selecciona una referencia.",
            tooltip: "Selecciona una referencia para la orden de compra.",
            tooltipReview: "Esta es la referencia asociada a la orden de compra.",
        },
        serie: {
            label: "Serie:",
            placeholder: "Ingresa la serie",
            helperText: "Por favor ingresa la serie.",
            tooltip: "Ingresa la serie de la orden de compra si aplica.",
            tooltipReview: "Esta es la serie asociada a la orden de compra.",
        },
        folio: {
            label: "* Folio:",
            placeholder: "Ingresa el folio",
            helperText: "Por favor ingresa el folio.",
            tooltip: "Ingresa el folio de la orden de compra.",
            tooltipReview: "Este es el folio asociado a la orden de compra.",
        },
        payDay: {
            label: "Fecha tentativa de pago:",
            placeholder: "Selecciona una fecha",
            helperText: "Por favor selecciona una fecha.",
            tooltip: "Selecciona la fecha de pago de la orden de compra.",
            tooltipReview: "Esta es la fecha de pago asociada a la orden de compra.",
        },
        errors: {
            uploadError: "Error al cargar la orden de compra. Por favor, verifica los archivos y referencia y vuelve a intentarlo.",
            getReferencesError: "Error al obtener las referencias. Por favor, intenta nuevamente más tarde.",
            updateStatusError: "Error al actualizar el estado de la orden de compra. Por favor, intenta nuevamente más tarde.",
        },
        rejectComments: {
            label: "Comentarios:",
            placeholder: "Ingresa los comentarios.",
            helperText: "Por favor ingresa los comentarios de rechazo. Luego vuelve a presionar el botón de rechazar.",
            tooltip: "Ingresa los comentarios de rechazo si la orden de compra es rechazada. Luego vuelve a presionar el botón de rechazar.",
        }
    },
    errors: {
        getordersError: "Error al obtener las ordenes de compra. Por favor, intenta nuevamente más tarde.",
        getReferencesError: "Error al obtener las referencias. Por favor, intenta nuevamente más tarde.",
        downloadFilesError: "Error al descargar los archivos. Por favor, intenta nuevamente más tarde.",
        getFunctionalAreasError: "Error al obtener las áreas funcionales. Por favor, intenta nuevamente más tarde.",
        getPartnersError: "Error al obtener los proveedores. Por favor, intenta nuevamente más tarde.", 
        getCompaniesError: "Error al obtener las empresas. Por favor, intenta nuevamente más tarde.",
        getCurrenciesError: "Error al obtener las monedas. Por favor, intenta nuevamente más tarde.",
    },
    
    ordersTable: {
        columns: {
            company: "Empresa",
            provider_name: "Proveedor",
            serie: "Serie",
            number: "Número",
            folio: "Folio",
            reference: "Referencia",
            amount: "Total",
            status: "Estatus",
            files: "Archivos",
            date: "Fecha",
            fiscal_use: "Uso CFDI",
            payday: "Fecha de pago",
            currency: "Moneda",
        },
        currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros",
        emptyMessage: "Sin datos para mostrar.",   
    }
}

export default orders;