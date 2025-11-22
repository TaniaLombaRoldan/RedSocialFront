// src/components/PublicationFollowing.jsx
import { useEffect, useRef } from "react";
import { useInfinitePublications } from "../hooks/useInfinitePublications";
import GetPublication from "./GetPublication";

/**
 * Lista infinita con las publicaciones de los usuarios seguidos.
 * Usa IntersectionObserver para pedir mas paginas al llegar al final.
 */
export default function PublicationFollowing() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useInfinitePublications("/publications/following", 5);
  const sentinelRef = useRef(null);

  useEffect(() => {
    // Observa el sentinel para disparar la siguiente pagina al entrar en viewport.
    if (!hasNextPage) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px 0px" }
    );
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, fetchNextPage]);

  // Mensajes tempranos mientras se cargan los datos o si ocurre un fallo.
  if (status === "loading") return <p>Cargando publicaciones...</p>;
  if (status === "error") return <p style={{ color: "red" }}>Error: {error.message}</p>;

  const items = data?.pages?.flatMap((p) => p.content || []) || []; // todas las publicaciones cargadas
  const totalPages = data?.pages?.[0]?.totalPages ?? 1; // total reportado por el backend
  const currentPage = data?.pages?.length ?? 1; // cuantas paginas llevamos cargadas

  return (
    <div style={{ padding: "20px" }}>
      <h2>Publicaciones de tus seguidos</h2>
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
      <div ref={sentinelRef} style={{ height: "4px" }} />
      {isFetchingNextPage && <p>Cargando mas...</p>}
      {!hasNextPage && items.length > 0 && <p>No hay mas publicaciones.</p>}
    </div>
  );
}
