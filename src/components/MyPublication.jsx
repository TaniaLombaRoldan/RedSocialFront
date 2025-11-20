// src/components/MyPublication.jsx
import { useAuth } from "../context/useAuth";
import { usePagination } from "../hooks/usePagination";
import GetPublication from "./GetPublication";

/**
 * Lista paginada con las publicaciones del usuario autenticado.
 * Se apoya en el hook de paginacion para cargar datos en bloques y mostrar mensajes de estado.
 * @returns {JSX.Element} Contenedor con publicaciones, paginador y feedback de carga/error.
 */
export default function MyPublication() {
  // Recuperamos al usuario actual para construir el endpoint filtrado por username.
  const { user } = useAuth();
  // Hook reutilizable que trae items, metadatos y callbacks de paginacion.
  const { items, page, totalPages, isLoading, isError, error, nextPage, prevPage } =
    usePagination(`/publication/public/${user.username}`, 5); // 5 elementos por pagina

  // Estados tempranos para mejorar UX mientras carga o cuando falla.
  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        Publicaciones (pagina {page + 1} de {totalPages})
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

      {/* Controles basicos de paginacion */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={prevPage} disabled={page === 0}>
          Anterior
        </button>
        <button
          onClick={nextPage}
          disabled={page >= totalPages - 1}
          style={{ marginLeft: "10px" }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
