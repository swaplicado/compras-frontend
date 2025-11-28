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
            placeholderMultiple: "Suelta aquí los archivos para comenzar a cargarlos",
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
        uploadInstructions: {
            header: "Para cargar un comprobante de pagos, sigue estos pasos:",
            step1: "Selecciona uno o varios pagos.",
            step3: "Selecciona el XML del comprobante de pago para su validación, en cuanto selecciones el xml este se validará automáticamente.",
            step4: "Una vez validado el XML, se mostrarán las observaciones del archivo que pudiera contener marcados con un signo de advetencia amarillo, si no contiene errores criticos marcados en rojo y con una X, se mostrarán los campos del archivo XML para que pueda continuar.",
            step5: "Selecciona los archivos asociados al comprobante de pago en el campo 'Archivos de comprobante de pago'.",
            step6: "Asegúrate de que los archivos no superen 5 MB cada uno y que en total no superen los 25 MB.",
            footer: `Puedes seleccionar varios archivos a la vez, pero asegúrate de que al menos uno sea un PDF.
             Si seleccionas archivos que no cumplen con estos requisitos, se mostrará un mensaje de error.`
        },
        uploadInstructionsPartner: {
            header: "Para cargar un comprobante de pagos, sigue estos pasos:",
            step1: "Selecciona un proveedor.",
            step2: "Selecciona uno o varios pagos.",
            step3: "Selecciona el XML del comprobante de pago para su validación, en cuanto selecciones el xml este se validará automáticamente.",
            step4: "Una vez validado el XML, se mostrarán las observaciones del archivo que pudiera contener marcados con un signo de advetencia amarillo, si no contiene errores criticos marcados en rojo y con una X, se mostrarán los campos del archivo XML para que pueda continuar.",
            step5: "Selecciona los archivos asociados al comprobante de pago en el campo 'Archivos de comprobante de pago'.",
            step6: "Asegúrate de que los archivos no superen 5 MB cada uno y que en total no superen los 25 MB.",
            footer: `Puedes seleccionar varios archivos a la vez, pero asegúrate de que al menos uno sea un PDF.
             Si seleccionas archivos que no cumplen con estos requisitos, se mostrará un mensaje de error.`   
        },
        reviewInstructions: {
            header: "Para revisar un comprobante de pagos, sigue estos pasos:",
            step1: "Revisa los archivos PDF y XML del comprobante de pagos.",
            step2: "Si el comprobante es correcto, presiona el botón Aceptar.",
            step3: "Si el comprobante es incorrecta, presiona el botón Rechazar para abrir el campo de comentarios de rechazo.",
            step4: "Ingresa los comentarios de rechazo y vuelve a presionar el botón Rechazar.",
            footer: "Asegúrate de que los comentarios sean claros y específicos para que el proveedor pueda corregir la factura."   
        }
    }
}

export default crp;