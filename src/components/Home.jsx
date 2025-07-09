import React, { useContext } from 'react';
import { LicenseContext } from '../utils/license';
import { FaBroom, FaHdd, FaTools } from 'react-icons/fa';

const Home = ({ message }) => {
  const { license, setLicense, setMessage } = useContext(LicenseContext);

  const run = async (script) => {
    if (!license.valid || license.uses <= 0) {
      setMessage('Licencia expirada');
      return;
    }
    try {
      const result = await window.api.runScript(script);
      if (result !== 'cancelado') {
        const uses = await window.api.decrementUsage();
        setLicense({ ...license, uses });
        setMessage('Optimización completada');
      }
    } catch (e) {
      setMessage('Error al ejecutar');
    }
  };

  return (
    <div>
      <div className="actions">
        <button onClick={() => run('scripts/limpiar.bat')} disabled={license.uses <= 0}><FaBroom style={{ marginRight: 8 }} /> Limpiar</button>
        <button onClick={() => run('scripts/optimizar_disco.bat')} disabled={license.uses <= 0}><FaHdd style={{ marginRight: 8 }} /> Optimización de disco</button>
        <button onClick={() => run('scripts/servicios.bat')} disabled={license.uses <= 0}><FaTools style={{ marginRight: 8 }} /> Optimizar servicios</button>
      </div>
      <div className="card">
        <h3>Licencia</h3>
        {license.valid ? (
          <p>Usos restantes: {license.uses}</p>
        ) : (
          <LicenseForm />
        )}
      </div>
      {message && <div className="card">{message}</div>}
    </div>
  );
};

const LicenseForm = () => {
  const { setLicense } = useContext(LicenseContext);
  const [input, setInput] = React.useState('');

  const validate = async () => {
    const res = await window.api.validateLicense(input);
    if (res.valid) {
      const data = await window.api.getUsage();
      setLicense({ key: input, uses: data.uses, valid: true });
    } else {
      alert('Licencia inválida');
    }
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ingrese licencia" />
      <button onClick={validate}>Validar</button>
    </div>
  );
};

export default Home;
