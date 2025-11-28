// src/components/MyPublication.jsx
/**
 * Lista infinita con las publicaciones del usuario autenticado.
 * Comentada linea a linea en español sin modificar la logica.
 */
// Hooks de React.
import { useEffect, useRef } from "react";
// Hook de auth para conocer el usuario.
import { useAuth } from "../hooks/useAuth";
// Hook de paginacion infinita.
import { useInfinitePublications } from "../hooks/useInfinitePublications";
// Componente que renderiza cada publicacion.
import GetPublication from "./GetPublication";

/**
 * Lista infinita con las publicaciones del usuario autenticado.
 * Dispara nuevas paginas al alcanzar el sentinel con scroll.
 */
export default function MyPublication() {
  // Usuario logueado para construir el endpoint.
  const { user } = useAuth();
  // Datos y helpers de la consulta infinita.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useInfinitePublications(`/publications/public/${user.username}`, 5);
  // Referencia al sentinel para IntersectionObserver.
  const sentinelRef = useRef(null);

  // Configura IntersectionObserver para cargar mas al final.
  useEffect(() => {
    // Si no quedan paginas, no observamos.
    if (!hasNextPage) return;
    // Elemento observado.
    const el = sentinelRef.current;
    // Observador que dispara fetchNextPage cuando entra en viewport.
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && fetchNextPage(),
      { rootMargin: "200px 0px" }
    );
    // Iniciar observacion si existe el elemento.
    if (el) observer.observe(el);
    // Cleanup de la observacion.
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, fetchNextPage]);

  // Estados tempranos para mejorar UX mientras carga o cuando falla.
  if (status === "loading") return <p>Cargando publicaciones...</p>;
  if (status === "error") return <p style={{ color: "red" }}>Error: {error.message}</p>;

  // Publicaciones propias acumuladas.
  const items = data?.pages?.flatMap((p) => p.content || []) || []; // publicaciones propias acumuladas
  // Total informado por el backend (primera pagina).
  const totalPages = data?.pages?.[0]?.totalPages ?? 1; // total informado por el backend
  // Numero de paginas ya cargadas.
  const currentPage = data?.pages?.length ?? 1; // numero de paginas ya cargadas

  // Render del listado.
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

      {/* Sentinel para IntersectionObserver */}
      <div ref={sentinelRef} style={{ height: "4px" }} />
      {/* Indicador mientras se busca la siguiente pagina */}
      {isFetchingNextPage && <p>Cargando mas...</p>}
      {/* Mensaje de fin cuando ya no hay mas paginas */}
      {!hasNextPage && items.length > 0 && <p>No hay mas publicaciones.</p>}
    </div>
  );
}
