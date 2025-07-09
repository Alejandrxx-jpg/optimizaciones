import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Home from '../components/Home';
import { LicenseContext } from '../utils/license';

const App = () => {
  const [section, setSection] = useState('Inicio');
  const [license, setLicense] = useState({ key: '', uses: 0, valid: false });
  const [message, setMessage] = useState('');

  const loadUsage = async () => {
    const data = await window.api.getUsage();
    if (data) {
      setLicense({ key: data.key, uses: data.uses, valid: true });
    }
  };

  useEffect(() => {
    loadUsage();
  }, []);

  return (
    <LicenseContext.Provider value={{ license, setLicense, setMessage }}>
      <div className="container">
        <Sidebar current={section} onChange={setSection} />
        <div className="main">
          {section === 'Inicio' && <Home message={message} />}
          {section === 'Licencia' && (
            <div className="card">
              <h2>Licencia</h2>
              <p>Clave: {license.key}</p>
              <p>Usos restantes: {license.uses}</p>
            </div>
          )}
        </div>
      </div>
    </LicenseContext.Provider>
  );
};

export default App;
