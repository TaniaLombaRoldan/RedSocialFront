/**
 * Cliente HTTP basico que adjunta el token si existe y maneja errores.
 * Comentado linea a linea en español sin tocar la logica original.
 */
// Exportamos la funcion principal de fetch.
export async function apiFetch(url, options = {}) {
  // Recuperamos el token guardado (si el usuario esta logueado).
  const token = localStorage.getItem("token");

  // Definimos la base de la API para centralizar la URL.
  const baseURL = "http://localhost:8080/api/v1";

  // Construimos headers combinando los recibidos con la cabecera Authorization si hay token.
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  // Solo añadimos Content-Type cuando hay body para evitar preflight en GET.
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  // Configuracion final de fetch que integra opciones y headers resultantes.
  const config = { ...options, headers };

  // Ejecutamos la peticion a la API concatenando la base con la ruta relativa.
  const res = await fetch(baseURL + url, config);

  // Si la sesion caduca y teniamos token, limpiamos credenciales y redirigimos.
  if ((res.status === 401 || res.status === 403) && token) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/");
    throw new Error("Sesion expirada");
  }

  // Si la respuesta tiene error (4xx o 5xx), construimos un mensaje claro.
  if (!res.ok) {
    // Valor por defecto con el codigo HTTP.
    let msg = `Error HTTP ${res.status}`;
    try {
      // Intentamos leer el cuerpo como JSON (formato ProblemDetail de Spring Boot).
      const body = await res.json();
      // Preferimos detail/title si existen; si no, serializamos el JSON.
      msg = body.detail || body.title || JSON.stringify(body);
    } catch {
      // Si no es JSON, leemos el texto plano.
      msg = await res.text();
    }
    // Lanzamos un error con el mensaje obtenido.
    throw new Error(msg || `Error HTTP ${res.status}`);
  }

  // Si la respuesta es correcta, leemos el cuerpo como texto.
  const text = await res.text();
  // Si hay texto, lo parseamos a JSON; si no, devolvemos null (ej. 204 No Content).
  return text ? JSON.parse(text) : null;
}
