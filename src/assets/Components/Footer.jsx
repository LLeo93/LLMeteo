{
  /*const apiKey = '51662e029381b9f9e3ff4003faed86c1';
const url16Days =
  'http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={51662e029381b9f9e3ff4003faed86c1}';
const urlNormal =
  'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={51662e029381b9f9e3ff4003faed86c1}';
  */
}
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  const [currentDate, setCurrentDate] = useState('');

  // Funzione per aggiornare la data e l'ora correnti
  const updateDate = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setCurrentDate(formattedDate);
  };

  // Aggiorna la data ogni secondo
  useEffect(() => {
    updateDate();
    const interval = setInterval(updateDate, 1000);
    return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
  }, []);

  return (
    <footer
      className="bg-dark text-white text-center position-fixed bottom-0 w-100"
      style={{ zIndex: 1000, padding: '1rem 0' }}
    >
      <p className="mb-0">LLMeteo - {currentDate}</p>
    </footer>
  );
};

export default Footer;
