import axios from 'axios';
import cookie from 'cookie'; // Importar la librería cookie para manejar las cookies
import appConfig from '/appConfig.json';

const createApiInstance = (baseURL) => {
    const api = axios.create({
        baseURL: baseURL || appConfig.mainRoute, // Usa el parámetro o un valor por defecto
    });

    api.interceptors.response.use(
        response => response,
        error => {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const cookieHeader = cookie.serialize('access_token', '', {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: -1, // Expira inmediatamente
              path: '/',
              sameSite: 'Strict',
            });
      
            return Promise.reject({ error, cookieHeader });
          }
      
          return Promise.reject(error);
        }
      );

    return api;
};

export default createApiInstance;