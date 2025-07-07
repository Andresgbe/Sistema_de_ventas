import { createContext, useContext, useState } from "react";
// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // "admin" o "user"

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

/*
  AuthContext.jsx

  Este archivo define y exporta un contexto de autenticación para la aplicación.
  Permite compartir el estado de autenticación y el rol del usuario entre los diferentes componentes
  de React sin necesidad de pasar props manualmente.

  - AuthContext: Es el contexto de React que almacena la información de autenticación.
  - AuthProvider: Es un componente proveedor que envuelve la aplicación (o parte de ella) y proporciona
    el estado de autenticación y los métodos para modificarlo.
  - useAuth: Es un hook personalizado que permite a los componentes acceder fácilmente al contexto de autenticación.

  Variables principales:
    - isAuthenticated: Booleano que indica si el usuario está autenticado.
    - setIsAuthenticated: Función para actualizar el estado de autenticación.
    - userRole: Rol del usuario autenticado ("admin" o "user").
    - setUserRole: Función para actualizar el rol del usuario.
*/

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
