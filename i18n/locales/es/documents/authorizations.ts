const authorizations = {
    flowAuthorization: {
        dialogHeader: "Flujo de autorización",
        flowAuthLabel: "Flujo de authorización",
        flowAuthTooltip: "Selecciona un flujo de autorización",
        flowAuthPlaceHolder: "Selecciona flujo de authorización",
        errors: {
            flowAuth: "Selecciona un flujo de autorización",
            sendAuthorizationAccept: "Error al enviar la factura a autorizar.",
            sendAuthorizationReject: "Error al enviar la factura a rechazar.",
        },
        animationSuccess: {
            title: "Factura enviada a autorizar.",
            text: "La factura se ha enviada a autorización correctamente.",
            titleReview: "Factura enviada.",
        },
        animationError: {
            title: "Error al enviar la factura.",
            text: "Ocurrió un error al enviar la factura, vuelve a intentarlo más tarde.",
            titleReview: "Error al enviar la factura.",
        },
        comments: {
            label: "Comentarios",
            placeholder: "Ingresa tus comentarios",
            tooltip: "Ingresa tus comentarios para que el autorizador las vea.",
        }
    },
    btnAuthorize: "Autorizar",
    btnReject: "Rechazar",
    comments: {
        label: 'Comentarios de autorización/rechazo.',
        tooltip: 'Comentarios de autorización/rechazo.',
    }
}

export default authorizations;