const uploadInvoicesDates = {
    title: "Configuración de fechas de cierre de carga de facturas",
    titleTooltip: "En esta sección podrás configurar las fechas en las que se cierra la carga de facturas para cada entidad, proveedor o empresa.",
    configTypes: {
        entityType: {
            label: 'Tipo de Entidad',
            value: 'entidad',

        },
        provider: {
            label: 'Por Proveedor',
            value: 'proveedor'
        },
        company: {
            label: 'Por Empresa',
            value: 'empresa'
        }
    },
    entityTypes: {
        physical: {
            label: 'Persona Física'
        },
        moral: {
            label: 'Persona Moral'
        }
    },
    optionsType: "Tipo de Configuración",
    optionFisica: "Persona Física",
    optionMoral: "Persona Moral",
    optionProvider: "Proveedor",
    optionCompany: "Empresa",
    selectOptionEntityType: "Tipo de Entidad",
    selectOptionEntityTypePlaceHolder: "Seleccione tipo de entidad",
    selectOptionProvider: "Seleccionar Proveedor",
    selectOptionProviderPlaceHolder: "Seleccione un proveedor",
    selectOptionCompany: "Seleccionar Empresa",
    selectOptionCompanyPlaceHolder: "Seleccione una empresa",
    year: "Año"
}

export default uploadInvoicesDates;