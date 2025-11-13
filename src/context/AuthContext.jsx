// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";


/**
 * Contexto global que almacena estado de autenticacion (token + usuario).
 * Permite acceder y actualizar credenciales desde cualquier componente.
 */
export const AuthContext = createContext();

/**
 * Proveedor que sincroniza token/usuario con localStorage y expone helpers.
 * @param {{ children: import("react").ReactNode }} props
 * @returns {JSX.Element} Provider con valores y acciones de autenticacion.
 */
export function AuthProvider({ children }) {
  // Inicializamos token y usuario leyendo del localStorage si existe.
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });


  // Cada vez que cambia el token lo persistimos o lo eliminamos del storage.
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);


  /**
   * Guarda token y usuario tras iniciar sesion.
   * @param {string} tokenValue
   * @param {Record<string, unknown>} [userData]
   */
  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData || null);


    localStorage.setItem("token", tokenValue);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
  };


  /**
   * Limpia las credenciales y el estado compartido.
   */
  const logout = () => {
    setToken(null);
    setUser(null);


    localStorage.removeItem("token");
    localStorage.removeItem("user");  
  };


  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated: !!token }}
    >
      {/* Renderizamos los descendientes para que consuman el contexto */}
      {children}
    </AuthContext.Provider>
  );
}




