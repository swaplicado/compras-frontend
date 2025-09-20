const commons = {
    btnShowInstructions: "Mostrar instrucciones",
    btnHideInstructions: "Ocultar instrucciones",
    btnSelectFiles: "Seleccionar",
    btnUpload: "Cargar",
    btnCancel: "Cancelar",
    btnClose: "Cerrar",
    btnSave: "Guardar",
    btnDelete: "Eliminar",
    btnDeleteTooltip: "Eliminar factura",
    btnEdit: "Guardar",
    btnSearch: "Busca",
    placeholderSearch: "Buscar  ",
    btnCleanFilter: "Limpiar todo",
    tooltipCleanFilter: "Limpiar filtros aplicados",
    btnClear: "Limpiar",
    btnContinue: "Continuar",
    btnBack: "Regresar",
    btnAccept: "Aceptar",
    btnReject: "Rechazar",
    btnDownload: "Descargar",
    btnSend: "Enviar",
    active: "Activo",
    inactive: "Inactivo",

    btnReload: "Recargar",
    tooltipBtnReload: "Recargar la página",

    erros: {
        requiredField: "Este campo es obligatorio.",
        invalidEmail: "Por favor ingresa un correo electrónico válido.",
        invalidNumber: "Por favor ingresa un número válido.",
        invalidDate: "Por favor ingresa una fecha válida.",
        fileTooLarge: "El archivo es demasiado grande, debe ser menor a 1 MB.",
        fileTypeNotSupported: "Tipo de archivo no soportado. Solo se permiten archivos PDF y XML.",
        downloadFiles: "Error al descargar los archivos, por favor intenta nuevamente.",
    },
    
    calendar: {
      firstDayOfWeek: 1,
      showMonthAfterYear: false,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Limpiar'
    },

    datatable: {
        emptyMessage: "Sin datos para mostrar.",
        currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros",
    }
};

export default commons;