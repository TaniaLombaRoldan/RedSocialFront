// src/components/ProfilePublication.jsx
import { useParams } from "react-router-dom";
import { usePagination } from "../hooks/usePagination";
import GetPublication from "./GetPublication";

/**
 * Lista paginada de publicaciones pertenecientes a un perfil publico.
 * Usa el parametro de la URL para solicitar los datos y delega el render a GetPublication.
 * @returns {JSX.Element} Bloque con publicaciones y controles de paginacion.
 */
export default function ProfilePublication() {
  // Obtenemos el nombre del perfil desde la ruta /profile/:name.
  const { name } = useParams();
  // Hook reutilizable que maneja data, estados y acciones de paginacion.
  const { items, page, totalPages, isLoading, isError, error, nextPage, prevPage } =
    usePagination(`/publication/public/${name}`, 5); // 5 elementos por pagina

  // Estados tempranos para feedback.
  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        Publicaciones (pagina {page + 1} de {totalPages})
      </h2>

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

      {/* Controles de paginacion simples */}
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
