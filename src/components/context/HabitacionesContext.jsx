import { createContext, useContext, useState } from "react";

const HabitacionesContext = createContext();

export const useHabitaciones = () => {
  const context = useContext(HabitacionesContext);
  if (!context) {
    throw new Error(
      "useHabitaciones debe usarse dentro de HabitacionesProvider",
    );
  }
  return context;
};

export const HabitacionesProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const notificarHabitacionCreada = () => {
    setRefreshKey((prev) => {
      const nuevoValor = prev + 1;
      return nuevoValor;
    });
  };

  return (
    <HabitacionesContext.Provider
      value={{
        refreshKey,
        notificarHabitacionCreada,
      }}
    >
      {children}
    </HabitacionesContext.Provider>
  );
};
