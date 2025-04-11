import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Nav.css';
import {
  Container,
  Nav,
  Navbar,
  Button,
  Form,
  FormControl,
  Alert,
} from 'react-bootstrap';
import { BsSearch, BsXCircle, BsStar } from 'react-icons/bs';
import { useState, useEffect, useRef } from 'react';

const apiKey = '51662e029381b9f9e3ff4003faed86c1';

const CustomNavbar = function (props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState(null);
  const [recentCities, setRecentCities] = useState([]);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const searchInputRef = useRef(null);

  const loadCitiesFromLocalStorage = () => {
    const savedRecentCities =
      JSON.parse(localStorage.getItem('recentCities')) || [];
    const savedFavoriteCities =
      JSON.parse(localStorage.getItem('favoriteCities')) || [];
    setRecentCities(savedRecentCities);
    setFavoriteCities(savedFavoriteCities);
  };

  useEffect(() => {
    loadCitiesFromLocalStorage();
  }, []);

  const saveRecentCity = (city) => {
    let savedCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!savedCities.includes(city)) {
      savedCities = [city, ...savedCities.slice(0, 2)];
      localStorage.setItem('recentCities', JSON.stringify(savedCities));
      setRecentCities(savedCities);
    }
  };

  const toggleFavoriteCity = (city) => {
    let updatedFavoriteCities = [...favoriteCities];
    if (updatedFavoriteCities.includes(city)) {
      updatedFavoriteCities = updatedFavoriteCities.filter(
        (item) => item !== city
      );
    } else {
      updatedFavoriteCities.push(city);
    }
    localStorage.setItem(
      'favoriteCities',
      JSON.stringify(updatedFavoriteCities)
    );
    setFavoriteCities(updatedFavoriteCities);
  };

  const handleCitySelect = (city) => {
    props.onCitySelect(city);
    saveRecentCity(city);
    localStorage.setItem('selectedCity', city);
    setSearchInput(city);
    setDropdownOpen(false);
  };

  const handleSearch = async () => {
    if (searchInput.trim()) {
      const searchCity = searchInput.trim();
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}&units=metric&lang=it`
        );
        const data = await response.json();
        if (data.cod === 200) {
          handleCitySelect(searchCity);
          setSearchInput('');
          setError(null);
        } else {
          setError('Città non trovata!');
        }
      } catch (err) {
        setError('Errore nel recuperare i dati meteo!');
        console.error('Errore nella fetch del meteo:', err);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const closeAlert = () => setError(null);

  const handleFocus = () => {
    loadCitiesFromLocalStorage();
    setDropdownOpen(true);
  };

  const handleClickOutside = (event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    const filtered = recentCities.filter((city) =>
      city.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {error && (
        <Alert variant="danger" className="m-3 alert-dismissible fade show">
          {error}
          <Button
            variant="link"
            className="text-white position-absolute top-0 end-0 p-0"
            onClick={closeAlert}
            style={{
              fontSize: '24px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '5px 15px',
            }}
          >
            <BsXCircle size={30} />
          </Button>
        </Alert>
      )}

      <div
        className="px-3"
        style={{
          backgroundImage:
            "url('https://italiaignota.com/wp-content/uploads/2021/07/copertina_certaldo_cosavedere.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          minHeight: '400px',
          paddingTop: '1rem',
        }}
      >
        <Navbar
          collapseOnSelect
          expand="lg"
          bg={props.tema}
          data-bs-theme={props.tema}
          className="position-sticky top-0 w-100"
          style={{ zIndex: 10 }}
        >
          <Container fluid>
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              onClick={() => setIsOpen(!isOpen)}
            />
            <Navbar.Collapse
              id="responsive-navbar-nav"
              className="w-100"
              in={isOpen}
            >
              <div className="d-flex justify-content-between w-100 align-items-center flex-wrap gap-2">
                <div className="d-flex flex-wrap">
                  {[
                    'Milano',
                    'Certaldo',
                    'Fiesole',
                    'Poggibonsi',
                    'Quarrata',
                  ].map((city) => (
                    <Nav key={city} className="me-1 d-flex align-items-center">
                      <h5
                        className="mb-0 text-white fs-6 border-2 border-double border-corallo rounded-3 p-2 bg-opacity-75 hover-effect city-button"
                        onClick={() => handleCitySelect(city)} // Selezionando una città dalla lista recente
                      >
                        {city}
                      </h5>
                    </Nav>
                  ))}
                </div>

                <Form
                  className="d-flex ms-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <FormControl
                    ref={searchInputRef}
                    type="text"
                    placeholder="Cerca città..."
                    className="me-2 transparent-input"
                    value={searchInput}
                    onChange={handleSearchChange} // Filtra le città mentre scrivi
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                  />
                  <Button
                    variant="outline-light"
                    onClick={handleSearch}
                    className="search-button"
                  >
                    <BsSearch />
                  </Button>
                </Form>

                {/* Stellina e dropdown preferiti nella stessa riga, ma allineati a destra */}
                <div className="d-flex align-items-center">
                  <Button
                    variant="link"
                    className="text-white"
                    onClick={() => toggleFavoriteCity(searchInput)} // Aggiungi o rimuovi dai preferiti
                  >
                    <BsStar size={24} />
                  </Button>

                  <div className="dropdown ms-3">
                    <Button
                      variant="link"
                      className="text-white dropdown-toggle"
                      id="dropdown-favorites"
                      data-bs-toggle="dropdown"
                    >
                      Preferiti
                    </Button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdown-favorites"
                    >
                      {favoriteCities.map((city, index) => (
                        <li key={index}>
                          <Button
                            variant="link"
                            className="dropdown-item text-dark"
                            onClick={() => handleCitySelect(city)} // Seleziona città dai preferiti
                          >
                            {city}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Tendina per la ricerca sotto la navbar */}
        {dropdownOpen && searchInput && (
          <div
            className="dropdown-menu show"
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)', // Posiziona la tendina sotto la barra di ricerca
              left: '0',
              width: '100%',
              backgroundColor: 'white',
              color: 'black',
              zIndex: 1050, // La tendina deve stare sopra gli altri elementi
              maxHeight: '200px',
              overflowY: 'auto',
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)', // Ombra per visibilità
            }}
          >
            {filteredCities.map((city, index) => (
              <Button
                key={index}
                variant="link"
                className="dropdown-item text-dark"
                onClick={() => handleCitySelect(city)} // Seleziona città dalla lista filtrata
              >
                {city}
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CustomNavbar;
