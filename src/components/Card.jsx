import React from 'react';

/** Simple contenedor con sombra para secciones de la interfaz */
const Card = ({ children }) => (
  <div className="card shadow">
    {children}
  </div>
);

export default Card;
