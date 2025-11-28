// src/components/PublicationList.jsx
/**
 * Lista infinita con todas las publicaciones publicas.
 * Comentada linea a linea en español sin modificar la logica.
 */
// Hooks de React para efectos y referencias DOM.
import { useEffect, useRef } from "react";
// Hook personalizado de paginacion infinita.
import { useInfinitePublications } from "../hooks/useInfinitePublications";
// Componente que renderiza una publicacion individual.
import GetPublication from "./GetPublication";

/**
 * Lista infinita con todas las publicaciones publicas.
 * Usa IntersectionObserver para pedir mas paginas al acercarse al final.
 */
export default function PublicationList() {
  // Extraemos datos y acciones del hook de paginacion infinita.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useInfinitePublications("/publications/", 5);
  // Referencia al elemento sentinel que dispara la carga de mas datos.
  const sentinelRef = useRef(null);

  // Efecto para configurar el IntersectionObserver.
  useEffect(() => {
    // Si no hay mas paginas, no configuramos observador.
    if (!hasNextPage) return;
    // Elemento DOM observado.
    const el = sentinelRef.current;
    // Creamos un observador que pide mas paginas al intersectar.
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && fetchNextPage(),
      { rootMargin: "200px 0px" }
    );
    // Si existe el elemento, comenzamos a observarlo.
    if (el) observer.observe(el);
    // Cleanup: dejamos de observar al desmontar o cambiar deps.
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, fetchNextPage]);

  // Respuestas tempranas segun el estado de la peticion.
  if (status === "loading") return <p>Cargando publicaciones...</p>;
  if (status === "error") return <p style={{ color: "red" }}>Error: {error.message}</p>;

  // Aplanamos todas las paginas para obtener un array de publicaciones.
  const items = data?.pages?.flatMap((p) => p.content || []) || []; // posts acumulados
  // Total de paginas reportado por el backend (de la primera pagina).
  const totalPages = data?.pages?.[0]?.totalPages ?? 1; // total reportado
  // Numero de paginas ya cargadas.
  const currentPage = data?.pages?.length ?? 1; // paginas ya cargadas

  // Render principal.
  return (
    <div style={{ padding: "20px" }}>
      {/* Titulo que muestra pagina actual y total. */}
      <h2>Publicaciones (pagina {currentPage} / {totalPages})</h2>

      {/* Mensaje cuando no existen publicaciones. */}
      {items.length === 0 && <p>No hay publicaciones disponibles.</p>}

      {/* Render de cada publicacion en la pagina actual. */}
      {items.map((pub) => (
        <GetPublication
          key={pub.id}
          id={pub.id}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
      ))}

      {/* Sentinel invisible para disparar IntersectionObserver. */}
      <div ref={sentinelRef} style={{ height: "4px" }} />
      {/* Indicador de carga de la siguiente pagina. */}
      {isFetchingNextPage && <p>Cargando mas...</p>}
      {/* Mensaje de fin de lista cuando ya no hay mas paginas. */}
      {!hasNextPage && items.length > 0 && <p>No hay mas publicaciones.</p>}
    </div>
  );
}
