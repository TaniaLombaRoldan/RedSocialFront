// Funciones de autenticacion basadas en apiFetch.
// Este archivo se comenta linea a linea sin modificar la logica.
import { apiFetch } from "./client";

/**
 * Registra un nuevo usuario enviando username y password.
 * @param {{username: string, password: string }} data Datos del formulario de registro.
 * @returns {Promise<any>} Respuesta de la API.
 */
export function registerUser(data) {
  // Hacemos una peticion POST a /auth/register.
  return apiFetch("/auth/register", {
    // Indicamos el metodo HTTP.
    method: "POST",
    // Serializamos el cuerpo en JSON.
    body: JSON.stringify(data),
  });
}

/**
 * Inicia sesion y obtiene el token JWT del backend.
 * @param {{ username: string, password: string }} data Credenciales del usuario.
 * @returns {Promise<any>} Respuesta de la API con token y datos.
 */
export function loginUser(data) {
  // Disparamos una peticion POST a /auth/login.
  return apiFetch("/auth/login", {
    // Metodo HTTP.
    method: "POST",
    // Cuerpo JSON con credenciales.
    body: JSON.stringify(data),
  });
}
