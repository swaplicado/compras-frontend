const oc = {
    titleAllOc: "Todas las OC",
    titleAllOcTooltip: "Pantalla para consultar todas las órdenes de compra.",
    titleAuthOc: "Autorizaciones de OC pendientes para mí",
    titleAuthOcTooltip: "Pantalla para consultar las órdenes de compra pendientes de mi autorización.",
    titleAuthorizedOc: "OC autorizadas",
    titleAuthorizedOcTooltip: "Pantalla para consultar las órdenes de compra autorizadas.",
    titleInProcessOc: "OC en autorización",
    titleInProcessOcTooltip: "Pantalla para consultar las órdenes de compra en proceso de autorización.",
    titleRejectedOc: "OC rechazadas en la autorización",
    titleRejectedOcTooltip: "Pantalla para consultar las órdenes de compra rechazadas durante la autorización.",

    viewInstructions: {
        searchOc: {
            header: "Filtrar ordenes de compra:",
            step1: "Utiliza el campo 'Buscar' para filtrar las ordenes de compra por cualquier campo visible en la tabla.",
            step2: "Escribe el texto que deseas buscar y la tabla se actualizará automáticamente para mostrar solo las ordenes de compra que coincidan con el texto ingresado.",
            step3: "Presiona el botón 'Limpiar filtros' para limpiar todos los filtros aplicados y mostrar todas las ordenes de compra nuevamente."
        },
        sortColumn: {
            header: "Ordenar por columna:",
            step1: "Haz clic en el encabezado de cualquier columna para ordenar las ordenes de compra por esa columna en orden ascendente o descendente.",
            step2: "El ícono de flecha junto al encabezado de la columna indica el orden actual (ascendente o descendente).",
            step3: "Para ordenar por varias columnas, mantenga presionada la tecla 'Ctrl' mientras selecciona los encabezados de las columnas que desea ordenar."
        },
        reloadView: {
            header: "Actualizar vista:",
            step1: "Presiona el botón de 'Recargar' para actualizar la vista y cargar los datos más recientes.",
        },
        // reviewOc: {
        //     header: "Revisar una orden de compra:",
        //     step1: "Haz doble clic en la fila de la orden de compra que deseas revisar.",
        //     step2: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para revisar la orden de compra.",
        // },
        downloadFiles: {
            header: "Descargar archivos de una orden de compra:",
            step1: "Presiona el botón de descarga en la columna 'Archivos' de la orden de compra que deseas descargar.",
            step2: "Se descargará un archivo ZIP que contiene los archivos PDF y XML de la orden de compra.",
        },
        authOc: {
            header: "Autorizar una orden de compra:",
            step1: "Haz doble clic en la fila de la orden de compra que deseas autorizar.",
            step2: "Se abrirá un cuadro de diálogo, el cual contiene más instrucciones para autorizar la orden de compra.",
        },
    },
    datatable: {
        columns: {
            priority: "Prioridad",
            company_trade_name: "Empresa",
            partner_full_name: "Proveedor",
            folio: "Folio",
            amount: "Monto",
            currency_code: "Moneda",
            date: "Fecha",
            accounting_type: "Tipo",
            authz_acceptance_name: "Aceptación",
            authz_authorization_name: "Autorización",
            files: "Archivos"
        }
    },
    dialog: {
        uploadTitle: "Cargar OC",
        viewTitle: "Orden de compra",
        editTitle: "Modificar OC",
        acceptedTitle: "OC",
        rejectedTitle: "OC",
        howToAuth: "¿Cómo autorizar una orden de compra?",

        authorizationInstructions: {
            header: "Autorizar una orden de compra:",
            step1: "En la parte inferior del diálogo, presione el botón 'Mostrar archivos' para consultar los archivos de la OC.",
            step2: "Si la orden de compra es correcta, presione el botón 'Autorizar'.",
            step3: "Si la orden de compra es incorrecta, ingrese un comentario en 'Comentarios de autorización/rechazo' con el motivo del rechazo y presione el botón 'Rechazar'.",
            footer: "Asegúrese de que los comentarios sean claros y específicos."
        },
        fields: {
            userOc: {
                label: "Usuario OC:",
                placeholder: "Usuario OC",
                tooltip: "Usuario que registró la orden de compra."
            },
            // sent_at: {
            //     label: "Enviado el:",
            //     placeholder: "Enviado el",
            //     tooltip: "Fecha en la que la orden de compra fue enviada."
            // },
            notes_start_auth: {
                label: "Comentarios al iniciarse la autorización:",
                placeholder: "Ingrese los comentarios del inicio de la autorización",
                tooltip: "Comentarios registrados al iniciar el proceso de autorización."
            },
            company: {
                label: "Empresa:",
                placeholder: "Seleccione la empresa",
                tooltip: "Empresa que emite la orden de compra."
            },
            partner: {
                label: "Proveedor:",
                placeholder: "Seleccione el proveedor",
                tooltip: "Proveedor al que se emite la orden de compra."
            },
            date: {
                label: "Fecha:",
                placeholder: "Fecha",
                tooltip: "Fecha de la orden de compra."
            },
            folio: {
                label: "Folio:",
                placeholder: "Folio",
                tooltip: "Folio que identifica la orden de compra."
            },
            files: {
                label: "Archivos:",
                placeholder: "Archivos",
                tooltip: "Archivos asociados a la orden de compra."
            },
            amount: {
                label: "Monto:",
                placeholder: "Monto",
                tooltip: "Monto total de la orden de compra."
            },
            currency: {
                label: "Moneda:",
                placeholder: "Moneda",
                tooltip: "Moneda en la que se expresa el monto de la orden de compra."
            },
            exchange_rate: {
                label: "Tipo de cambio:",
                placeholder: "Tipo de cambio",
                tooltip: "Tipo de cambio monetario de la orden de compra."
            },
            authz_authorization_notes: {
                label: "Comentarios de autorización/rechazo:",
                placeholder: "Ingrese los comentarios de autorización o rechazo",
                tooltip: "Comentarios registrados durante la autorización o rechazo de la orden de compra."
            },
            subtotal_local: {
                label: "Subtotal mon. loc.:",
                placeholder: "Subtotal mon. loc.",
                tooltip: "Subtotal de la orden de compra expresado en moneda local."
            },
            total_local: {
                label: "Total mon. loc.:",
                placeholder: "Total mon. loc.",
                tooltip: "Total de la orden de compra expresado en moneda local."
            },
            subtotalOc: {
                label: "Subtotal:",
                placeholder: "Subtotal",
                tooltip: "Subtotal de la orden de compra antes de impuestos."
            },
            totalOc: {
                label: "Total:",
                placeholder: "Total",
                tooltip: "Total de la orden de compra."
            },
            notesOc: {
                label: "Notas de la OC:",
                placeholder: "Notas de la OC",
                tooltip: "Notas asociadas a la orden de compra."
            },
            nature: {
                label: "Tipo de contabilización:",
                placeholder: "Tipo de contabilización",
                tooltip: "Determina el destino contable de la orden de compra."
            },
            CeCo: {
                concepts: {
                    label: "Concepto/gasto:",
                    placeholder: "Concepto/gasto",
                    tooltip: "Concepto de gasto o ítems de referencia de las partidas de la orden de compra."
                },
                cost_profit_center: {
                    label: "Centros costo",
                    placeholder: "Centros costo",
                    tooltip: "Centro(s) de costo asignado(s) directamente a la Orden de Compra"
                },
                cost_profit_center_req: {
                    label: "Centros de costo de la requisición",
                    placeholder: "Centros costo de la requisición",
                    tooltip: "Centros de costo de la requisición a nivel de encabezado, mostrando su porcentaje de distribución. En la requisición puede venir más de un CC."
                },
                cost_profit_center_req_ety: {
                    label: "Centros de costo de las partidas de la requisición",
                    placeholder: "Centros costo de las partidas de la requisición",
                    tooltip: "Centros de costo de las partidas de la requisición. Si la partida tiene CC asignado, se toma ese por encima del encabezado."
                }
            },
            account_tag: {
                label: "Etiqueta contable:",
                placeholder: "Etiqueta contable",
                tooltip: "Etiqueta para clasificar la orden de compra en los registros contables."
            },
            localCurrencySubtitle: "Moneda local",
            docCurrencySubtitle: "Moneda del documento",
            notesOcSubtitle: "Notas de la OC",
            docRowsSubtitle: "Partidas del documento",
            materialRequestSubtitle: "Requisición",
            mrUser: {
                label: "Solicitante:",
                placeholder: "",
                tooltip: "Usuario que realizó la requisición."
            },
            mrFolio: {
                label: "Folio:",
                placeholder: "",
                tooltip: "Folio que identifica la requisición."
            },
            mrDate: {
                label: "Fecha de captura:",
                placeholder: "",
                tooltip: "Fecha en la que se registró la requisición."
            },
            mrRequiredDate: {
                label: "Fecha requerida de entrega:",
                placeholder: "",
                tooltip: "Fecha límite establecida (por el solicitante) para la entrega del material."
            },
            mrPriority: {
                label: "Prioridad:",
                placeholder: "",
                tooltip: "Prioridad con la que se solicita el material."
            },
            mrType: {
                label: "Tipo:",
                placeholder: "",
                tooltip: "Tipo de requisición. Por ejemplo, Resurtido: proviene de almacén."
            },
            mrNotes: {
                label: "Notas de la requisición:",
                placeholder: "",
                tooltip: "Notas asociadas a la requisición."
            },
            fiscal_use: {
                label: "Uso CFDI:",
                placeholder: "",
                tooltip: "Propósito fiscal que el receptor le dará a esta orden de compra."
            },
            withOutMr: "La referencia no tiene una requisición asociada.",
            authzCommentsSubtitle: "Comentarios de autorización",
            filesSubtitles: "Archivos",
            authHistorySubtitle: "Historial de autorizaciones",
        },
        tableEtys: {
            columns: {
                cve: "Cve.",
                concept: "Concepto",
                amount: "Cantidad",
                unit: "Unidad",
                previus_price: "Precio ant.",
                variation: "% var.",
                unit_price: "Precio unit.",
                subtotal: "Subtotal",
                transferred_tax: "Impuesto trasladado",
                withheld_tax: "Impuesto retenido",
                total: "Total",
                currency: "Moneda",
                center_cost: "Centro de costo"
            }
        },
        tableItemHistory: {
            columns: {
                conceptKey: "Clave",
                concept: "Concepto",
                currentPriceUnitary: "Precio un. actual",
                priceUnitary: "Precio un. anterior",
                percentage: "% Variación",
                quantity: "Cantidad",
                unitSymbol: "Unidad",
                lastProvider: "Proveedor",
                numFact: "Factura",
                lastPurchaseDate: "Fecha",
            },
            no_previous_price: "Sin precio anterior",
        },
        animationSuccess: {
            authorizedTitle: "Orden de compra autorizada.",
            authorizedText: "La orden de compra se ha autorizado correctamente.",
            rejectedTitle: "Orden de compra rechazada.",
            rejectedText: "La orden de compra se ha rechazado correctamente."
        },
        animationError: {
            authorizedTitle: "Error al autorizar la orden de compra.",
            authorizedText: "Ocurrió un error al autorizar la orden de compra.",
            rejectedTitle: "Error al rechazar la orden de compra.",
            rejectedText: "Ocurrió un error al rechazar la orden de compra."
        }
    }
}

export default oc