import { useState } from 'react';
import CustomNavbar from './assets/Components/CustomNavbar';
import Footer from './assets/Components/Footer';
import HomePage from './assets/Components/HomePage';

function App() {
  const [selectedCity, setSelectedCity] = useState('Milano'); // Città di default

  return (
    <>
      <CustomNavbar onCitySelect={setSelectedCity} />
      <HomePage selectedCity={selectedCity} />
      <Footer />
    </>
  );
}

export default App;
