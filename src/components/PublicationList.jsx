// src/components/PublicationList.jsx
import { useEffect, useRef } from "react";
import { useInfinitePublications } from "../hooks/useInfinitePublications";
import GetPublication from "./GetPublication";

/**
 * Lista infinita con todas las publicaciones publicas.
 * Usa IntersectionObserver para pedir mas paginas al acercarse al final.
 */
export default function PublicationList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useInfinitePublications("/publications/", 5);
  const sentinelRef = useRef(null);

  useEffect(() => {
    // Observador para cargar la siguiente pagina al acercarse al final.
    if (!hasNextPage) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && fetchNextPage(),
      { rootMargin: "200px 0px" }
    );
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, fetchNextPage]);

  // Respuestas tempranas segun el estado de la peticion.
  if (status === "loading") return <p>Cargando publicaciones...</p>;
  if (status === "error") return <p style={{ color: "red" }}>Error: {error.message}</p>;

  const items = data?.pages?.flatMap((p) => p.content || []) || []; // posts acumulados
  const totalPages = data?.pages?.[0]?.totalPages ?? 1; // total reportado
  const currentPage = data?.pages?.length ?? 1; // paginas ya cargadas

  return (
    <div style={{ padding: "20px" }}>
      <h2>Publicaciones (pagina {currentPage} / {totalPages})</h2>

      {/* Mensaje cuando no existen publicaciones */}
      {items.length === 0 && <p>No hay publicaciones disponibles.</p>}

      {/* Render de cada publicacion en la pagina actual */}
      {items.map((pub) => (
        <GetPublication
          key={pub.id}
          id={pub.id}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
      ))}

      <div ref={sentinelRef} style={{ height: "4px" }} />
      {isFetchingNextPage && <p>Cargando mas...</p>}
      {!hasNextPage && items.length > 0 && <p>No hay mas publicaciones.</p>}
    </div>
  );
}
