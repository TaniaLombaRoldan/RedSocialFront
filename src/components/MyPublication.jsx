import { useAuth } from "../context/useAuth";
import { usePagination } from "../hooks/usePagination";
import GetPublication from "./GetPublication";


export default function MyPublication() {
  const { user } = useAuth();
  const { items, page, totalPages, isLoading, isError, error, nextPage, prevPage } =
    usePagination(`/publication/public/${user.username}`, 5); // 👈 endpoint y tamaño de página


  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;
  


  return (
    <div style={{ padding: "20px" }}>
      <h2>Publicaciones (página {page + 1} de {totalPages})</h2>


      {items.length === 0 && <p>No hay publicaciones disponibles.</p>}


      {items.map((pub) => (
        <GetPublication
          key={pub.id}
          id={pub.id}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
      ))}


      <div style={{ marginTop: "20px" }}>
        <button onClick={prevPage} disabled={page === 0}>
          ← Anterior
        </button>
        <button onClick={nextPage} disabled={page >= totalPages - 1} style={{ marginLeft: "10px" }}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}
