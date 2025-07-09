import React, { useContext, useState } from 'react';
import Card from './Card';
import Button from './Button';
import { LicenseContext } from '../utils/license';
import { AlertTriangle } from 'lucide-react';

/**
 * Muestra información de la licencia y permite reiniciarla
 */
const LicenseInfo = () => {
  const { license, setLicense } = useContext(LicenseContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const reset = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    await window.api.resetLicense();
    setLicense({ key: '', uses: 0, valid: false });
    setShowConfirm(false);
  };

  return (
    <Card>
      <h2>Licencia</h2>
      {license.valid ? (
        <>
          <p>Clave: {license.key}</p>
          <p>Usos restantes: {license.uses}</p>
          <Button onClick={reset} style={{ marginTop: 10 }}>
            {showConfirm ? 'Confirmar reinicio' : 'Reiniciar licencia'}
          </Button>
        </>
      ) : (
        <p><AlertTriangle size={18} /> Sin licencia activa</p>
      )}
    </Card>
  );
};

export default LicenseInfo;
