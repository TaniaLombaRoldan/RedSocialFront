// src/components/PublicationList.jsx
import { usePagination } from "../hooks/usePagination";
import GetPublication from "./GetPublication";

/**
 * Lista paginada con todas las publicaciones publicas.
 * Se apoya en el hook de paginacion para hacer scroll por /publication/.
 * @returns {JSX.Element} Bloque con publicaciones y controles de pagina anterior/siguiente.
 */
export default function PublicationList() {
  // Hook generico que centraliza la logica de paginacion.
  const { items, page, totalPages, isLoading, isError, error, nextPage, prevPage } =
    usePagination("/publication/", 5);

  // Respuestas tempranas segun el estado de la peticion.
  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        Publicaciones (pagina {page + 1} de {totalPages})
      </h2>

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

      {/* Controles para moverse entre paginas */}
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
