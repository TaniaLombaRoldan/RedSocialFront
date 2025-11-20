// src/components/PublicationFollowing.jsx
import { usePagination } from "../hooks/usePagination";
import GetPublication from "./GetPublication";

/**
 * Lista paginada con las publicaciones de los usuarios seguidos.
 * Usa el hook de paginacion para consumir /publication/following y renderiza cada item.
 * @returns {JSX.Element} Contenedor con publicaciones y controles de paginacion.
 */
export default function PublicationFollowing() {
  // Proveemos el endpoint fijo y el tamano de pagina de 5 elementos.
  const { items, page, totalPages, isLoading, isError, error, nextPage, prevPage } =
    usePagination("/publication/following", 5);

  // Mensajes tempranos mientras se cargan los datos o si ocurre un fallo.
  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        Publicaciones (pagina {page + 1} de {totalPages})
      </h2>

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

      {/* Controles de navegacion entre paginas */}
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
