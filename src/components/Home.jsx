import React, { useContext } from 'react';
import { LicenseContext } from '../utils/license';
import { FaBroom, FaHdd, FaTools } from 'react-icons/fa';
import Button from './Button';
import Card from './Card';

const Home = ({ message }) => {
  const { license, setLicense, setMessage } = useContext(LicenseContext);

  const run = async (script) => {
    const cfg = JSON.parse(localStorage.getItem('config') || '{}');
    if (cfg[script] === false) return;
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
        window.api.saveReport(script, result);
      }
    } catch (e) {
      setMessage('Error al ejecutar');
    }
  };

  return (
    <div>
      <div className="actions">
        <Button onClick={() => run('scripts/limpiar.bat')} disabled={license.uses <= 0}><FaBroom style={{ marginRight: 8 }} /> Limpiar</Button>
        <Button onClick={() => run('scripts/optimizar_disco.bat')} disabled={license.uses <= 0}><FaHdd style={{ marginRight: 8 }} /> Optimización de disco</Button>
        <Button onClick={() => run('scripts/servicios.bat')} disabled={license.uses <= 0}><FaTools style={{ marginRight: 8 }} /> Optimizar servicios</Button>
      </div>
      <Card>
        <h3>Licencia</h3>
        {license.valid ? (
          <>
            <p>Usos restantes: {license.uses}</p>
            <div style={{ background: '#eee', height: 10, borderRadius: 5 }}>
              <div style={{ background: '#4caf50', width: `${(license.uses / 3) * 100}%`, height: '100%', borderRadius: 5 }} />
            </div>
          </>
        ) : (
          <LicenseForm />
        )}
      </Card>
      {message && <Card>{message}</Card>}
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
      <Button onClick={validate} style={{ marginLeft: 10 }}>Validar</Button>
    </div>
  );
};

export default Home;
