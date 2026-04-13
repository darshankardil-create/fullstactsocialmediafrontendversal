"use client";
import { createContext } from "react";
import { useState } from "react";

//context
export const ContextPro = createContext();

//context wrapper function

const Context = ({ children }) => {
  const [myinfodoc, setmyinfodoc] = useState({});

  return (
    <ContextPro.Provider value={{ myinfodoc, setmyinfodoc }}>
      {children}
    </ContextPro.Provider>
  );
};

export default Context;
