// src/context/useAuth.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Hook de conveniencia que expone el contexto de autenticacion.
 * @returns {{ token: string|null, user: object|null, login: Function, logout: Function, isAuthenticated: boolean }}
 */
export function useAuth() {
  // Delegamos en useContext para obtener los valores expuestos por AuthProvider.
  return useContext(AuthContext);
}
