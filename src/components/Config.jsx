import React, { useEffect, useState } from 'react';
import Card from './Card';

/**
 * Panel de configuración para elegir qué scripts se ejecutarán.
 * Guarda la configuración en localStorage.
 */
const defaultScripts = [
  { label: 'Limpiar', value: 'scripts/limpiar.bat' },
  { label: 'Optimización de disco', value: 'scripts/optimizar_disco.bat' },
  { label: 'Optimizar servicios', value: 'scripts/servicios.bat' }
];

const Config = () => {
  const [enabled, setEnabled] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('config');
    if (stored) {
      setEnabled(JSON.parse(stored));
    } else {
      const initial = {};
      defaultScripts.forEach(s => initial[s.value] = true);
      setEnabled(initial);
    }
  }, []);

  const toggle = (value) => {
    const newState = { ...enabled, [value]: !enabled[value] };
    setEnabled(newState);
    localStorage.setItem('config', JSON.stringify(newState));
  };

  return (
    <Card>
      <h3>Configuración de scripts</h3>
      {defaultScripts.map(s => (
        <label key={s.value} style={{ display: 'block', marginBottom: 8 }}>
          <input type="checkbox" checked={enabled[s.value] || false} onChange={() => toggle(s.value)} /> {s.label}
        </label>
      ))}
    </Card>
  );
};

export default Config;
