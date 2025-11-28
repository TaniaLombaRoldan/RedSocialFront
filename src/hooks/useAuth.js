/**
 * Hook y helper para acceder al contexto de autenticacion compartido.
 * No modifica el flujo; solo expone el contenido de AuthContext.
 */
// src/context/useAuth.jsx
// Importamos useContext para consumir cualquier contexto de React.
import { useContext } from "react";
// Importamos el contexto que contiene token, usuario y acciones de auth.
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Hook de conveniencia que expone el contexto de autenticacion.
 * @returns {{ token: string|null, user: object|null, login: Function, logout: Function, isAuthenticated: boolean }}
 */
export function useAuth() {
  // Obtenemos los valores actuales del contexto sin alterar la logica existente.
  return useContext(AuthContext);
}
