import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Home from '../components/Home';
import Config from '../components/Config';
import LicenseInfo from '../components/LicenseInfo';
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
          {section === 'Licencia' && <LicenseInfo />}
          {section === 'Configuración' && <Config />}
        </div>
      </div>
    </LicenseContext.Provider>
  );
};

export default App;
