import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import {
  BsSun,
  BsCloudRain,
  BsWind,
  BsCloud,
  BsSnow,
  BsCloudDrizzle,
} from 'react-icons/bs';
import './HomePage.css';

const HomePage = ({ selectedCity }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  const apiKey = '51662e029381b9f9e3ff4003faed86c1';

  const getWeatherData = async (city) => {
    try {
      // METEO ATTUALE
      const resCurrent = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`
      );
      const dataCurrent = await resCurrent.json();

      if (dataCurrent.cod !== 200) {
        setError('Errore nel recupero del meteo attuale');
        return;
      }

      setCurrentWeather({
        temperature: dataCurrent.main.temp,
        weatherType: dataCurrent.weather[0].description,
        time: new Date(
          (dataCurrent.dt + dataCurrent.timezone) * 1000
        ).toLocaleTimeString('it-IT', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });

      // FORECAST
      const resForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=it`
      );
      const dataForecast = await resForecast.json();

      if (dataForecast.cod !== '200') {
        setError('Errore nel recupero della previsione');
        return;
      }

      const daily = {};
      dataForecast.list.forEach((entry) => {
        const date = new Date(entry.dt * 1000);
        const day = date.toLocaleDateString('it-IT', { weekday: 'long' });

        if (
          !daily[day] &&
          day !== new Date().toLocaleDateString('it-IT', { weekday: 'long' })
        ) {
          daily[day] = {
            day,
            date: date.toLocaleDateString(),
            max: entry.main.temp_max,
            min: entry.main.temp_min,
            precipitation: entry.pop * 100,
            wind: entry.wind.speed,
          };
        }
      });

      setForecast(Object.values(daily).slice(0, 4));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Errore generale nel recuperare i dati meteo.');
    }
  };

  useEffect(() => {
    if (selectedCity) {
      getWeatherData(selectedCity);
    }
  }, [selectedCity]);

  const getWeatherIcon = (description) => {
    if (!description) return <BsSun size={40} style={{ color: 'yellow' }} />; // Aggiunto controllo per description null/undefined

    const desc = description.toLowerCase();
    if (desc.includes('pioggia'))
      return <BsCloudRain size={40} style={{ color: 'blue' }} />;
    if (desc.includes('neve'))
      return <BsSnow size={40} style={{ color: 'white' }} />;
    if (desc.includes('nubi') || desc.includes('nuvol'))
      return <BsCloud size={40} style={{ color: 'gray' }} />;
    if (desc.includes('pioviggine'))
      return <BsCloudDrizzle size={40} style={{ color: 'lightgreen' }} />;
    return <BsSun size={40} style={{ color: 'yellow' }} />;
  };

  return (
    <Container fluid className="bg-dark text-white px-4 py-3">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* METEO ATTUALE */}
      <Row className="mb-4">
        <Col md={12} className="text-center">
          <h2 className="display-4 fw-bold text-uppercase mb-0">
            {selectedCity}
          </h2>
          <h1 className="display-1">{currentWeather?.temperature}°</h1>
          <div className="d-flex justify-content-center align-items-center">
            {getWeatherIcon(currentWeather?.weatherType)}
            <h5 className="ms-2 text-capitalize">
              {currentWeather?.weatherType}
            </h5>
          </div>
          <p className="text-muted">{currentWeather?.time}</p>
        </Col>
      </Row>

      {/* FORECAST */}
      <Row className="g-4 mb-5">
        {' '}
        {/* Aggiunto margin-bottom qui per distanziare il footer */}
        {forecast.map((dayForecast, index) => (
          <Col key={index} md={3} sm={6} xs={12}>
            <Card className="forecast-card h-100 text-white">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div className="text-center">
                  <h5 className="fw-bold">{dayForecast.day}</h5>
                  <p>{dayForecast.date}</p>
                </div>

                <div className="text-center">
                  <BsSun size={40} style={{ color: 'yellow' }} />
                  <h6>
                    Max: {dayForecast.max}° Min: {dayForecast.min}°
                  </h6>
                </div>

                <div className="d-flex justify-content-between">
                  <div className="text-center">
                    <BsCloudRain size={20} style={{ color: 'blue' }} />
                    <p className="mb-0">
                      Precip.: {dayForecast.precipitation.toFixed(0)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <BsWind size={20} />
                    <p className="mb-0">Vento: {dayForecast.wind} km/h</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;
