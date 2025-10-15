const crp = {
    titleUpload: "Carga de comprobantes de recepción de pagos",
    titleAccepted: "Comprobantes de recepción de pagos aceptados",
    titleRejected: "Comprobantes de recepción de pagos rechazados",
    textBtnCreate: "Cargar CRP",
    datatable: {
        columns: {
            company : "Empresa",
            date: "Fecha",
            folio: "Folio",
            uuid: "UUID",
            authz_acceptance_name: "Estatus",
            files: "Archivos",
        }
    },
    dialog: {
        uploadTitle: "Carga de CRP",
        viewTitle: "CRP",
        editTitle: "Editar CRP",
        acceptedTitle: "CRP",
        rejectedTitle: "CRP",
        files: {
            label: "Archivos del comprobante de pago: *",
            placeholderMultiple: "Suelte los archivos aquí para comenzar a cargarlos",
            placeholderSingle: "Suelte el archivo aquí para comenzar a cargarlo",
            helperTextFiles: "Selecciona los archivos del comprobante de pago.",
            helperTextPdf: "Debe cargar la representación impresa en PDF del comprobante de pago.",
            helperTextXml: "Debe cargar un archivo XML.",
            tooltip: "Selecciona los archivos del comprobante de pago.",
            invalidFileSize: "El tamaño máximo por archivo es de 5 MB.",
            invalidFileSizeMessageSummary: "Archivo demasiado grande.",
            invalidFileType: "Solo se permiten archivos PDF, XML, PNG Y JPEG.",
            invalidAllFilesSize: "El tamaño máximo de los archivos es de 25 MB.",
            hasSameFile: "No es necesario volver a cargar el archivo {{xmlName}} en la sección Archivos.",
            hasMatchingPDF: "Es necesario que se cargue la representación impresa en PDF del comprobante de pago y que tenga el mismo nombre que el archivo XML {{xmlBaseName}}.",
        },
    }
}

export default crp;