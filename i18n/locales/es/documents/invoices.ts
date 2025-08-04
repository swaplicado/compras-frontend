export default {
    title: "Facturas",
    btnOpenDialogUpload: "Cargar factura",
    tooltipBtnOpenDialogUpload: "Cargar una nueva factura",
    uploadDialog: { 
        headerCreate: "Cargar factura",
        headerReview: "Aceptar o rechazar factura",
        uploadInstructions: {
            header: "Para cargar una factura, sigue estos pasos:",
            step1: "Todos los campos marcados con un * son obligatorios.",
            step2: "Selecciona una referencia para la factura.",
            step3: "Ingresa la serie (si aplica) y el folio de la factura.",
            step4: "Presiona el botón Seleccionar y selecciona los archivos PDF y XML correspondientes a la factura.",
            step5: "Asegúrate de que los archivos no superen los 1 MB y que contengan un PDF y un XML.",
            footer: `Puedes seleccionar varios archivos a la vez, pero asegúrate de que al menos uno sea un PDF y otro un XML.
             Si seleccionas archivos que no cumplen con estos requisitos, se mostrará un mensaje de error.`
        },
        reviewInstructions: {
            header: "Para revisar una factura, sigue estos pasos:",
            step1: "Revisa los archivos PDF y XML de la factura.",
            step2: "Si la factura es correcta, presiona el botón Aceptar.",
            step3: "Si la factura es incorrecta, presiona el botón Rechazar para abrir el campo de comentarios de rechazo.",
            step4: "Ingresa los comentarios de rechazo y vuelve a presionar el botón Rechazar.",
            footer: "Asegúrate de que los comentarios sean claros y específicos para que el proveedor pueda corregir la factura."
        },
        provider: {
            label: "* Proveedor:",
            placeholder: "Selecciona un proveedor",
            helperText: "Por favor selecciona un proveedor.",
            tooltip: "Selecciona el proveedor asociado a la factura.",
            tooltipReview: "Este es el proveedor asociado a la factura.",
        },
        company:  {
            label: "* Entidad comercial:",
            placeholder: "Selecciona una empresa",
            helperText: "Por favor selecciona una empresa.",
            tooltip: "Selecciona la empresa a la que pertenece la factura.",
            tooltipReview: "Esta es la empresa a la que pertenece la factura.",
        },
        reference: {
            label: "* Referencia:",
            placeholder: "Selecciona una referencia",
            helperText: "Por favor selecciona una referencia.",
            tooltip: "Selecciona una referencia para la factura.",
            tooltipReview: "Esta es la referencia asociada a la factura.",
        },
        serie: {
            label: "Serie:",
            placeholder: "Ingresa la serie",
            helperText: "Por favor ingresa la serie.",
            tooltip: "Ingresa la serie de la factura si aplica.",
            tooltipReview: "Esta es la serie asociada a la factura.",
        },
        folio: {
            label: "* Folio:",
            placeholder: "Ingresa el folio",
            helperText: "Por favor ingresa el folio.",
            tooltip: "Ingresa el folio de la factura.",
            tooltipReview: "Este es el folio asociado a la factura.",
        },
        files: {
            label: "* Archivos de factura:",
            placeholder: "Suelte los archivos aquí para comenzar a cargarlos",
            helperTextFiles: "Selecciona los archivos de la factura.",
            helperTextPdf: "Debe incluir un archivo PDF.",
            helperTextXml: "Debe incluir un archivo XML.",
            tooltip: "Selecciona los archivos de la factura (PDF y XML).",
            invalidFileSize: "El tamaño máximo del archivo es de 1 MB.",
            invalidFileSizeMessageSummary: "Archivo demasiado grande",
            invalidFileType: "Solo se permiten archivos PDF y XML.",
            invalidAllFilesSize: "El tamaño máximo de los archivos es de 1 MB.",
        },
        animationSuccess: {
            title: "Factura cargada.",
            text: "La factura se ha cargado correctamente.",
        },
        animationError: {
            title: "Error al cargar la factura.",
            text: "Ocurrió un error al cargar la factura, vuelve a intentarlo mas tarde.",
        },
        errors: {
            uploadError: "Error al cargar la factura. Por favor, verifica los archivos y referencia y vuelve a intentarlo.",
            getReferencesError: "Error al obtener las referencias. Por favor, intenta nuevamente más tarde.",
            updateStatusError: "Error al actualizar el estado de la factura. Por favor, intenta nuevamente más tarde.",
        },
        rejectComments: {
            label: "Comentarios de rechazo:",
            placeholder: "Ingresa los comentarios de rechazo.",
            helperText: "Por favor ingresa los comentarios de rechazo. Luego vuelve a presionar el botón de rechazar.",
            tooltip: "Ingresa los comentarios de rechazo si la factura es rechazada. Luego vuelve a presionar el botón de rechazar.",
        }
    },
    btnDownloadFiles: "Descargar archivos",
}