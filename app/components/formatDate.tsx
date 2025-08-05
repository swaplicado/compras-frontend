import React from 'react';
import moment from 'moment';
import 'moment/locale/es'; // Importa el locale español (opcional)
/**
 * Componente para formatear fechas utilizando Moment.js.
 *
 * @param {string | Date} date - La fecha a formatear, puede ser un string o un objeto Date.
 * @param {string} format - El formato de la fecha (opcional, por defecto 'DD/MM/YYYY').
 * @param {string} locale - El locale a utilizar para el formateo (opcional, por defecto 'es').
 * @returns {JSX.Element} Un elemento span con la fecha formateada.
 */
const DateFormatter = ( date: string | Date, format = 'DD-MMM-YYYY', locale = 'es') => {
  // Configura el locale (opcional)
  moment.locale(locale);
  
  // Formatea la fecha
  const formattedDate = moment(date).format(format);
  
  return <span>{formattedDate}</span>;
};

export default DateFormatter;