const resetPassword = {
    descriptionProvider: "Como proveedor nacional ingresa tu RFC.",
    descriptionExtProvider: "Como proveedor extranjero ingresa las 3 siglas en formato ISO alpha3 de tu país, seguido de un guion y el RFC, por ejemplo USA-XEX010101000.",
    descriptionInternalUser: "Como usuario interno ingresa tu cuenta de usuario.",
    resetPassword: {
        label: "Usuario",
        placeholder: "Proveedor: Tu RFC, Usuario interno: Tu cuenta de usuario",
        helperText: "Por favor ingresa tu nombre de usuario.",
    },
    btnBackToLogin: "Regresar a login",
    emailSentMessage: "Se ha enviado un correo electrónico a {{secretEmail}} con instrucciones para restablecer su contraseña. " + 
    "Ten en cuenta que el enlace que viene adjunto en el correo de restablecimiento de contraseña expira en {{expiredTime}}.",
    noSecretEmail: "El usuario {{username}} no tiene correo electrónico registrado, por favor contacta a la empresa."
}

export default resetPassword;