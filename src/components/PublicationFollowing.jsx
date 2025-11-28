// src/components/PublicationFollowing.jsx
/**
 * Lista infinita con las publicaciones de los usuarios seguidos.
 * Comentada linea a linea en español sin modificar la logica.
 */
// Hooks de React para efectos y referencias.
import { useEffect, useRef } from "react";
// Hook infinito para obtener publicaciones de seguidos.
import { useInfinitePublications } from "../hooks/useInfinitePublications";
// Componente que renderiza cada publicacion.
import GetPublication from "./GetPublication";

/**
 * Lista infinita con las publicaciones de los usuarios seguidos.
 * Usa IntersectionObserver para pedir mas paginas al llegar al final.
 */
export default function PublicationFollowing() {
  // Extraemos data y controles del hook personalizado.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useInfinitePublications("/publications/following", 5);
  // Sentinel para el observador de scroll.
  const sentinelRef = useRef(null);

  // Efecto que crea un IntersectionObserver para cargar mas paginas.
  useEffect(() => {
    // Si no hay mas paginas, no configuramos el observador.
    if (!hasNextPage) return;
    // Elemento observado.
    const el = sentinelRef.current;
    // Observador que dispara fetchNextPage al intersectar.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px 0px" }
    );
    // Arrancamos la observacion si el sentinel existe.
    if (el) observer.observe(el);
    // Cleanup para dejar de observar cuando cambian deps o se desmonta.
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, fetchNextPage]);

  // Mensajes tempranos mientras se cargan los datos o si ocurre un fallo.
  if (status === "loading") return <p>Cargando publicaciones...</p>;
  if (status === "error") return <p style={{ color: "red" }}>Error: {error.message}</p>;

  // Aplanamos todas las paginas para acumular publicaciones.
  const items = data?.pages?.flatMap((p) => p.content || []) || []; // todas las publicaciones cargadas
  // Numero total de paginas segun backend (tomado de la primera).
  const totalPages = data?.pages?.[0]?.totalPages ?? 1; // total reportado por el backend
  // Cuantas paginas ya hemos traido.
  const currentPage = data?.pages?.length ?? 1; // cuantas paginas llevamos cargadas

  // Render principal.
  return (
    <div style={{ padding: "20px" }}>
      {/* Titulo general del feed de seguidos. */}
      <h2>Publicaciones de tus seguidos</h2>
      {/* Subtitulo con informacion de pagina actual. */}
      <h3>
        Publicaciones (pagina {currentPage} / {totalPages})
      </h3>

      {/* Mensaje cuando no hay publicaciones de seguidos */}
      {items.length === 0 && <p>No hay publicaciones disponibles.</p>}

      {/* Render de cada publicacion usando el componente generico */}
      {items.map((pub) => (
        <GetPublication
          key={pub.id}
          id={pub.id}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
      ))}
      {/* Sentinel invisible para disparar carga de la siguiente pagina. */}
      <div ref={sentinelRef} style={{ height: "4px" }} />
      {/* Indicador mientras se obtiene la siguiente pagina. */}
      {isFetchingNextPage && <p>Cargando mas...</p>}
      {/* Mensaje final cuando ya no quedan paginas. */}
      {!hasNextPage && items.length > 0 && <p>No hay mas publicaciones.</p>}
    </div>
  );
}
