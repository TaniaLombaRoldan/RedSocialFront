// src/components/ProfilePublication.jsx
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useInfinitePublications } from "../hooks/useInfinitePublications";
import GetPublication from "./GetPublication";

/**
 * Lista infinita de publicaciones de un perfil publico concreto.
 * Usa el parametro :name de la URL y solicita mas paginas al hacer scroll.
 */
export default function ProfilePublication() {
  const { name } = useParams();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useInfinitePublications(`/publications/public/${name}`, 5);
  const sentinelRef = useRef(null);

  useEffect(() => {
    // Observa el sentinel para cargar la siguiente pagina al hacer scroll.
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

  // Estados tempranos para feedback.
  if (status === "loading") return <p>Cargando publicaciones...</p>;
  if (status === "error") return <p style={{ color: "red" }}>Error: {error.message}</p>;

  const items = data?.pages?.flatMap((p) => p.content || []) || []; // publicaciones del perfil acumuladas
  const totalPages = data?.pages?.[0]?.totalPages ?? 1; // total reportado por la API
  const currentPage = data?.pages?.length ?? 1; // cuantas paginas se han cargado

  return (
    <div style={{ padding: "20px" }}>
      <h2>Publicaciones (pagina {currentPage} / {totalPages})</h2>

      {/* Mensaje cuando el perfil no tiene publicaciones */}
      {items.length === 0 && <p>No hay publicaciones disponibles.</p>}

      {/* Render de cada publicacion individual */}
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
