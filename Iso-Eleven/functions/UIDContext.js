// UIDContext.js
import { createContext, useContext, useState } from 'react';

const UIDContext = createContext();

export const UIDProvider = ({ children }) => {
  const [uid, setUID] = useState(null);

  return (
    <UIDContext.Provider value={{ uid, setUID }}>
      {children}
    </UIDContext.Provider>
  );
};

export const useUID = () => useContext(UIDContext);
