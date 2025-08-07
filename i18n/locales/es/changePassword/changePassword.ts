import { animationSuccess } from "@/app/components/commons/animationResponse";

export default {
    title: "Cambio de contraseña",
    newPassword: {
        label: "Nueva contraseña",
        placeholder: "Nueva contraseña",
        helperText: "Por favor ingresa tu nueva contraseña.",
    },
    confirmPassword: {
        label: "Confirmar contraseña",
        placeholder: "Confirmar contraseña",
        helperText: "Por favor ingresa la confirmación de la contraseña.",
    },
    btnShowPassword: {
        tooltip: "Mostrar/ocultar contraseña",
    },
    btnUpdatePassword: "Actualizar contraseña",
    animationSuccess: {
        title: "¡Contraseña actualizada con éxito!",
        text: "Tu contraseña ha sido cambiada correctamente.",
    },
    animationError: {
        title: "No se pudo actualizar tu contraseña",
        text: "Tu contraseña no ha sido cambiada. Intenta nuevamente más tarde.",
    },
    errors: {
        passwordsDoNotMatch: "Las contraseñas no coinciden.",
        updateError: "Error al actualizar la contraseña. Por favor, intenta nuevamente más tarde.",
    },
}