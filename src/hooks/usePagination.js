// src/hooks/usePagination.jsx
/**
 * Hook reutilizable que implementa paginacion basica.
 * Incluimos comentarios linea a linea en español sin alterar la logica.
 */
// Importamos useState para manejar el numero de pagina.
import { useState } from "react";
// Importamos useQuery de React Query para gestionar fetch y cache.
import { useQuery } from "@tanstack/react-query";
// Cliente HTTP centralizado.
import { apiFetch } from "../api/client";

/**
 * Hook reutilizable que implementa paginacion basica sobre cualquier endpoint.
 * Hace peticiones con los parametros page, size y sort=createDate,desc.
 * @param {string} endpoint Ruta base a consultar.
 * @param {number} [pageSize=5] Cantidad de elementos por pagina.
 * @returns {{
 *   items: Array<any>,
 *   page: number,
 *   totalPages: number,
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error | null,
 *   nextPage: () => void,
 *   prevPage: () => void,
 * }}
 */
export function usePagination(endpoint, pageSize = 5) {
  // Estado local de la pagina actual (comienza en 0).
  const [page, setPage] = useState(0);

  // React Query maneja cache y estados de peticion.
  const { data, isLoading, isError, error } = useQuery({
    // La clave identifica la query segun endpoint y pagina actual.
    queryKey: [endpoint, page],
    // Concatenamos parametros de paginacion y orden descendente por fecha.
    queryFn: () =>
      apiFetch(
        `${endpoint}?page=${page}&size=${pageSize}&sort=createDate,desc`
      ),
    // Mantiene datos previos mientras llega la nueva pagina para evitar parpadeos.
    keepPreviousData: true,
  });

  // Normalizamos el shape del backend.
  const items = data?.content || [];
  const totalPages = data?.totalPages || 1;

  // Scroll suave al inicio de la pagina tras cambiar pagina.
  const scrollToTop = () => {
    // Comprobamos que estamos en navegador antes de usar window.
    if (typeof window !== "undefined" && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Avanza una pagina mientras no lleguemos al final.
  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage((p) => p + 1);
      scrollToTop();
    }
  };

  // Retrocede siempre que no estemos en la primera pagina.
  const prevPage = () => {
    if (page > 0) {
      setPage((p) => p - 1);
      scrollToTop();
    }
  };

  // Exponemos estado y handlers para que el componente consumidor los use.
  return {
    items,
    page,
    totalPages,
    isLoading,
    isError,
    error,
    nextPage,
    prevPage,
  };
}
