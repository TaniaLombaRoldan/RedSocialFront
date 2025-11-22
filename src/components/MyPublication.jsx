// src/components/MyPublication.jsx
import { useEffect, useRef } from "react";
import { useAuth } from "../context/useAuth";
import { useInfinitePublications } from "../hooks/useInfinitePublications";
import GetPublication from "./GetPublication";

/**
 * Lista infinita con las publicaciones del usuario autenticado.
 * Dispara nuevas paginas al alcanzar el sentinel con scroll.
 */
export default function MyPublication() {
  const { user } = useAuth(); // usuario logueado para construir el endpoint
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useInfinitePublications(`/publications/public/${user.username}`, 5);
  const sentinelRef = useRef(null);

  useEffect(() => {
    // Observa el sentinel para solicitar mas publicaciones propias al llegar al final.
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

  // Estados tempranos para mejorar UX mientras carga o cuando falla.
  if (status === "loading") return <p>Cargando publicaciones...</p>;
  if (status === "error") return <p style={{ color: "red" }}>Error: {error.message}</p>;

  const items = data?.pages?.flatMap((p) => p.content || []) || []; // publicaciones propias acumuladas
  const totalPages = data?.pages?.[0]?.totalPages ?? 1; // total informado por el backend
  const currentPage = data?.pages?.length ?? 1; // numero de paginas ya cargadas

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        Publicaciones (pagina {currentPage} / {totalPages})
      </h2>

      {/* Mensaje cuando el usuario no tiene publicaciones */}
      {items.length === 0 && <p>No hay publicaciones disponibles.</p>}

      {/* Iteramos cada publicacion usando el componente reutilizable */}
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
