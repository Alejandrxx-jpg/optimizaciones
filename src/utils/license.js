import { createContext } from 'react';

export const LicenseContext = createContext({
  license: { key: '', uses: 0, valid: false },
  setLicense: () => {},
  setMessage: () => {},
});
