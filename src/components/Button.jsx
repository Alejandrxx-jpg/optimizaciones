import React from 'react';
import { motion } from 'framer-motion';

/**
 * Botón con animación usando Framer Motion.
 * Recibe las mismas props que un botón normal.
 */
const Button = ({ children, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="shadow"
    {...props}
  >
    {children}
  </motion.button>
);

export default Button;
