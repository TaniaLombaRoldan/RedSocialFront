// src/hooks/usePagination.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
    queryKey: [endpoint, page],
    // Concatenamos parametros de paginacion y orden descendente por fecha.
    queryFn: () =>
      apiFetch(
        `${endpoint}?page=${page}&size=${pageSize}&sort=createDate,desc`
      ),
    keepPreviousData: true,
  });

  // Normalizamos el shape del backend.
  const items = data?.content || [];
  const totalPages = data?.totalPages || 1;

  // Avanza una pagina mientras no lleguemos al final.
  const nextPage = () => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  };

  // Retrocede siempre que no estemos en la primera pagina.
  const prevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };

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
