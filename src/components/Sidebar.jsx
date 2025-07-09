import React from 'react';
import { Home, BadgeCheck, Settings } from 'lucide-react';

const Sidebar = ({ current, onChange }) => {
  // Secciones principales de la aplicación
  const sections = [
    { name: 'Inicio', icon: <Home size={18} style={{ marginRight: 8 }} /> },
    { name: 'Licencia', icon: <BadgeCheck size={18} style={{ marginRight: 8 }} /> },
    { name: 'Configuración', icon: <Settings size={18} style={{ marginRight: 8 }} /> }
  ];
  return (
    <div className="sidebar">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'white', margin: '0 auto', color: '#0e2544', lineHeight: '60px', fontWeight: 'bold' }}>MO</div>
      </div>
      {sections.map((sec) => (
        <button key={sec.name} onClick={() => onChange(sec.name)} style={{ fontWeight: current === sec.name ? 'bold' : 'normal', display: 'flex', alignItems: 'center' }}>
          {sec.icon} {sec.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
