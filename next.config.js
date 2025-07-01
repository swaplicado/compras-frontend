/** @type {import('next').NextConfig} */

const nextConfig = {
    // Soporte para reescrituras de rutas (útil para manejar rutas dinámicas o redirecciones)
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: '/:path*',
        },
      ];
    },
    // Habilita soporte para el subdominio personalizado
    basePath: '',
    env: {
      NEXT_PUBLIC_BASE_URL: 'https://aeth.swaplicado.com',
    },
    // Habilita source maps para depuración en producción
    productionBrowserSourceMaps: true,
    // Configuración de Webpack para source maps y optimización
    webpack: (config, { isServer, dev }) => {
      if (dev) {
        config.devtool = 'source-map';
      } else if (isServer) {
        config.devtool = 'inline-source-map';
      } else {
        config.devtool = 'source-map';
      }
      config.optimization = {
        ...config.optimization,
        minimize: dev ? false : config.optimization.minimize,
      };
      return config;
    },
  };

module.exports = nextConfig
