const resetPassword = {
    descriptionProvider: "Como proveedor nacional ingresa tu RFC.",
    descriptionExtProvider: "Como proveedor extranjero ingresa el código ISO alpha-3 en idioma inglés de tu país, seguido de un guión, seguido de tu ID fiscal en tu país.",
    descriptionInternalUser: "Como usuario interno ingresa tu cuenta de usuario.",
    resetPassword: {
        label: "Usuario",
        placeholder: "Proveedor: Tu RFC o tu país y ID fiscal; Usuario interno: Tu cuenta de usuario",
        helperText: "Por favor ingresa tu nombre de usuario.",
    },
    btnBackToLogin: "Regresar a login",
    emailSentMessage: "Se ha enviado un correo electrónico a {{secretEmail}} con instrucciones para restablecer tu contraseña. " + 
    "Ten en cuenta que el enlace adjunto en el correo de restablecimiento de contraseña expira en {{expiredTime}}.",
    noSecretEmail: "El usuario {{username}} no tiene correo electrónico registrado, por favor contacta a la empresa."
}

export default resetPassword;
