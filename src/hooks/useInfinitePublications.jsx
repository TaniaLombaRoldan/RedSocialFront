// src/hooks/useInfinitePublications.jsx
import { useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

/**
 * Hook para infinite scroll paginado con React Query.
 * Usa pageParam para pedir la siguiente pagina y calcula cuando detenerse.
 * @param {string} endpoint Endpoint base (sin query params).
 * @param {number} pageSize Tamaño de página a solicitar.
 * @returns {import("@tanstack/react-query").UseInfiniteQueryResult}
 */
export function useInfinitePublications(endpoint, pageSize = 5) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: [endpoint, pageSize],
    // Fetch de la página actual con sort descendente por fecha.
    queryFn: ({ pageParam = 0 }) =>
      apiFetch(`${endpoint}?page=${pageParam}&size=${pageSize}&sort=createDate,desc`),
    // Calcula el siguiente pageParam hasta agotar totalPages.
    getNextPageParam: (lastPage, allPages) => {
      const nextIndex = allPages.length; // siguiente pagina = cantidad ya cargada
      const total = lastPage?.totalPages ?? 1;
      return nextIndex < total ? nextIndex : undefined;
    },
    // Fuerza a recargar al volver a montar y a no mantener datos previos.
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
  });

  // Limpia la cache al desmontar el consumidor para que al volver se reinicie.
  useEffect(
    () => () => {
      queryClient.removeQueries({ queryKey: [endpoint, pageSize] });
    },
    [queryClient, endpoint, pageSize]
  );

  return query;
}
