// src/components/ProfilePublication.jsx
/**
 * Lista infinita de publicaciones de un perfil publico concreto.
 * Comentada linea a linea en español sin modificar la logica.
 */
// Hooks de React.
import { useEffect, useRef } from "react";
// Hook de router para leer el parametro de la URL.
import { useParams } from "react-router-dom";
// Hook de paginacion infinita para publicaciones.
import { useInfinitePublications } from "../hooks/useInfinitePublications";
// Componente que pinta cada publicacion.
import GetPublication from "./GetPublication";

/**
 * Lista infinita de publicaciones de un perfil publico concreto.
 * Usa el parametro :name de la URL y solicita mas paginas al hacer scroll.
 */
export default function ProfilePublication() {
  // Extraemos el nombre de usuario desde la URL.
  const { name } = useParams();
  // Configuramos la query infinita para ese usuario.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useInfinitePublications(`/publications/public/${name}`, 5);
  // Sentinel para IntersectionObserver.
  const sentinelRef = useRef(null);

  // Efecto que configura el observador de scroll para cargar mas paginas.
  useEffect(() => {
    // Si ya no hay mas paginas, no observar.
    if (!hasNextPage) return;
    // Elemento sentinel.
    const el = sentinelRef.current;
    // Observador que dispara la siguiente pagina al intersectar.
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && fetchNextPage(),
      { rootMargin: "200px 0px" }
    );
    // Iniciamos observacion si existe el elemento.
    if (el) observer.observe(el);
    // Cleanup de observador.
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, fetchNextPage]);

  // Estados tempranos para feedback.
  if (status === "loading") return <p>Cargando publicaciones...</p>;
  if (status === "error") return <p style={{ color: "red" }}>Error: {error.message}</p>;

  // Publicaciones del perfil acumuladas.
  const items = data?.pages?.flatMap((p) => p.content || []) || []; // publicaciones del perfil acumuladas
  // Total de paginas reportado por la API.
  const totalPages = data?.pages?.[0]?.totalPages ?? 1; // total reportado por la API
  // Cuantas paginas se han cargado hasta ahora.
  const currentPage = data?.pages?.length ?? 1; // cuantas paginas se han cargado

  // Render principal.
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

      {/* Sentinel para IntersectionObserver */}
      <div ref={sentinelRef} style={{ height: "4px" }} />
      {/* Indicador de carga de la siguiente pagina */}
      {isFetchingNextPage && <p>Cargando mas...</p>}
      {/* Mensaje final cuando no quedan paginas */}
      {!hasNextPage && items.length > 0 && <p>No hay mas publicaciones.</p>}
    </div>
  );
}
