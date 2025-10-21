// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importaciones de los namespaces
import esLogin from './locales/es/auth/login';
import esInvoices from './locales/es/documents/invoices';
import esOrders from './locales/es/documents/orders';
import common from './locales/es/commons';
import esTopBar from './locales/es/topBar/topBar';
import esChangePassword from './locales/es/changePassword/changePassword';
import esFooter from './locales/es/footer/footer';
import esResetPassword from './locales/es/auth/resetPassword';
import esLogout from './locales/es/auth/logout';
import esFileViewer from './locales/es/documents/fileViewer';
import esAuthorizations from './locales/es/documents/authorizations';
import esPayments from './locales/es/documents/payments';
import esCatalogPartners from './locales/es/partners/catalog';
import esCrp from './locales/es/documents/crp';
import esNc from './locales/es/documents/nc';
import esPartners from './locales/es/partners/partners';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        // otros namespaces en inglés
      },
      es: {
        login: esLogin,
        invoices: esInvoices,
        orders: esOrders,
        common: common,
        topBar: esTopBar,
        changePassword: esChangePassword,
        footer: esFooter,
        resetPassword: esResetPassword,
        logout: esLogout,
        fileViewer: esFileViewer,
        authorizations: esAuthorizations,
        payments: esPayments,
        catalogPartners: esCatalogPartners,
        crp: esCrp,
        nc: esNc,
        partners: esPartners
      }
    },
    lng: "es",
    fallbackLng: "es",
    interpolation: {
      escapeValue: false
    },
    react: {
        transSupportBasicHtmlNodes: true, // Permite usar HTML básico en las traducciones
        transKeepBasicHtmlNodesFor: ['strong', 'em', 'b', 'i'], // Elementos permitidos
    },
    // Opcional: configura namespaces si quieres cargarlos dinámicamente
    ns: ['login', 'common'], // lista de namespaces
    defaultNS: 'login'       // namespace por defecto
  });

export default i18n;