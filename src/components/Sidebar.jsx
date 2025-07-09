import React from 'react';

const Sidebar = ({ current, onChange }) => {
  const sections = ['Inicio', 'Limpiar', 'Optimizar disco', 'Servicios', 'Licencia', 'Configuración'];
  return (
    <div className="sidebar">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'white', margin: '0 auto', color: '#0e2544', lineHeight: '60px', fontWeight: 'bold' }}>MO</div>
      </div>
      {sections.map((sec) => (
        <button key={sec} onClick={() => onChange(sec)} style={{ fontWeight: current === sec ? 'bold' : 'normal' }}>
          {sec}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
