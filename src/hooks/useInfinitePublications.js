// src/hooks/useInfinitePublications.jsx
/**
 * Hook para paginar publicaciones de forma infinita con React Query.
 * Incluye comentarios linea a linea sin alterar la logica original.
 */
// Importamos useEffect para limpiar la cache al desmontar.
import { useEffect } from "react";
// Traemos los helpers de React Query para consultas infinitas y acceso al cliente.
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// Cliente HTTP centralizado para consumir el backend.
import { apiFetch } from "../api/client";

/**
 * Hook para infinite scroll paginado con React Query.
 * Usa pageParam para pedir la siguiente pagina y calcula cuando detenerse.
 * @param {string} endpoint Endpoint base (sin query params).
 * @param {number} pageSize Tamano de pagina a solicitar.
 * @returns {import("@tanstack/react-query").UseInfiniteQueryResult}
 */
export function useInfinitePublications(endpoint, pageSize = 5) {
  // Obtenemos el cliente global de React Query para manipular la cache.
  const queryClient = useQueryClient();

  // Configuramos la consulta infinita asociada al endpoint y pageSize.
  const query = useInfiniteQuery({
    // Clave unica para este conjunto de datos paginados.
    queryKey: [endpoint, pageSize],
    // Funcion de fetch de la pagina actual con sort descendente por fecha.
    queryFn: ({ pageParam = 0 }) =>
      apiFetch(`${endpoint}?page=${pageParam}&size=${pageSize}&sort=createDate,desc`),
    // Calcula el siguiente pageParam hasta agotar totalPages.
    getNextPageParam: (lastPage, allPages) => {
      // La siguiente pagina se basa en cuantas ya se cargaron.
      const nextIndex = allPages.length; // siguiente pagina = cantidad ya cargada
      // Total de paginas que reporta el backend; por defecto 1 para evitar undefined.
      const total = lastPage?.totalPages ?? 1;
      // Solo devolvemos un numero si aun quedan paginas por pedir.
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
    // Devolvemos una funcion de cleanup que borra la query especifica.
    () => () => {
      // Eliminamos la query para liberar memoria y estado.
      queryClient.removeQueries({ queryKey: [endpoint, pageSize] });
    },
    // Dependencias que disparan la limpieza si cambian.
    [queryClient, endpoint, pageSize]
  );

  // Exponemos el objeto de React Query tal cual para que el consumidor lo use.
  return query;
}
