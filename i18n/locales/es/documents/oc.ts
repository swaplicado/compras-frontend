const oc = {
    titleAuthOc: "Autorizaciones de OC pendientes para mí",
    titleAuthorizedOc: "OC autorizadas",
    titleAuthorizedOcTooltip: "Ordenes de compra autorizadas",
    titleInProcessOc: "OC en autorización",
    titleInProcessOcTooltip: "Ordenes de compra en proceso de autorización",
    titleRejectedOc: "OC rechazadas en la autorización",
    titleRejectedOcTooltip: "Ordenes de compra rechazadas",
    datatable: {
        columns: {
            priority: "Prioridad",
            company_trade_name: "Empresa",
            partner_full_name: "Proveedor",
            folio: "Folio",
            amount: "Monto",
            currency_code: "Moneda",
            date: "Fecha",
            authz_acceptance_name: "Aceptación",
            authz_authorization_name: "Autorización",
            files: "Archivos"
        }
    },
    dialog: {
        uploadTitle: "Carga de OC",
        viewTitle: "Orden de compra",
        editTitle: "Editar OC",
        acceptedTitle: "OC",
        rejectedTitle: "OC",
        fields: {
            userOc: {
                label: "Usuario OC:",
                placeholder: "Usuario OC",
                tooltip: "Usuario OC"
            },
            sent_at: {
                label: "Enviado el:",
                placeholder: "Enviado el",
                tooltip: "Enviado el"
            },
            notes_start_auth: {
                label: "Comentarios al iniciarse la autorización:",
                placeholder: "Comentarios al iniciarse la autorización:",
                tooltip: "Comentarios al iniciarse la autorización:"
            },
            company: {
                label: "Empresa:",
                placeholder: "Empresa",
                tooltip: "Empresa"
            },
            partner: {
                label: "Proveedor:",
                placeholder: "Proveedor",
                tooltip: "Proveedor"
            },
            date: {
                label: "Fecha",
                placeholder: "Fecha",
                tooltip: "Fecha"
            },
            folio: {
                label: "Folio",
                placeholder: "Folio",
                tooltip: "Folio"
            },
            files: {
                label: "Archivos",
                placeholder: "Archivos",
                tooltip: "Archivos"
            },
            amount: {
                label: "Monto",
                placeholder: "Monto",
                tooltip: "Monto"
            },
            currency: {
                label: "Moneda",
                placeholder: "Moneda",
                tooltip: "Moneda"
            },
            exchange_rate: {
                label: "Tipo de cambio",
                placeholder: "Tipo de cambio",
                tooltip: "Tipo de cambio"
            },
            authz_authorization_notes: {
                label: "Comentarios de autorización/rechazo:",
                placeholder: "Comentarios de autorización/rechazo:",
                tooltip: "Comentarios de autorización/rechazo:",
            },
            subtotal_local: {
                label: "Subtotal Mon. Loc.",
                placeholder: "Subtotal Mon. Loc.",
                tooltip: "Subtotal Mon. Loc."
            },
            total_local: {
                label: "Total Mon. Loc.",
                placeholder: "Total Mon. Loc.",
                tooltip: "Total Mon. Loc."
            },
            subtotalOc: {
                label: "Subtotal",
                placeholder: "Subtotal",
                tooltip: "Subtotal"
            },
            totalOc: {
                label: "Total",
                placeholder: "Total",
                tooltip: "Total"
            },
            notesOc: {
                label: "Notas de la OC",
                placeholder: "Notas de la OC",
                tooltip: "Notas de la OC"
            },
            CeCo: {
                concepts: {
                    label: "Concepto/gasto",
                    placeholder: "Concepto/gasto",
                    tooltip: "Concepto/gasto"
                },
                cost_profit_center: {
                    label: "Centros costo",
                    placeholder: "Centros costo",
                    tooltip: "Centros costo"
                }
            }
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
                center_cost: "Centro costo"
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
            }
        },
        animationSuccess: {
            authorizedTitle: "Orden de compra autorizada.",
            authorizedText: "La nota de crédito se ha autorizado correctamente.",
            rejectedTitle: "Orden de compra rechazada.",
            rejectedText: "La nota de crédito se ha rechazado correctamente."
        },
        animationError: {
            authorizedTitle: "Error al autorizar la nota de crédito.",
            authorizedText: "Ocurrió un error al autorizar la nota de crédito.",
            rejectedTitle: "Error al rechazar la nota de crédito.",
            rejectedText: "Ocurrió un error al rechazar la nota de crédito."
        },
        reviewInstructions: {
            header: "Para revisar una nota de crédito, sigue estos pasos:",
            step1: "Haz doble clic sobre el renglón de la OC a revisar, se abrirá el diálogo con la información de la OC para revisar.",
            step2: "En la parte inferior del diálogo se encuentra un botón Mostrar archivos, presiona este botón para ver los archivos de la OC.",
            step3: "Para aceptar la OC solo presiona el botón Aceptar.",
            step4: "Para rechazar la OC debes ingresar un comentario con el motivo del rechazo, luego presiona el botón Rechazar."
        },
    }
}

export default oc