// src/pages/HomePage.jsx
/**
 * Pagina de inicio con el feed de usuarios seguidos.
 * Comentada linea a linea en español sin alterar el comportamiento.
 */
// Cabecera general con navegacion y perfil.
import Header from "../components/Header";
// Listado de publicaciones de usuarios seguidos.
import PublicationFollowing from "../components/PublicationFollowing";

/**
 * Pagina de inicio que muestra publicaciones de los usuarios seguidos.
 * @returns {JSX.Element} Layout con cabecera y feed personalizado.
 */
export default function HomePage() {
  // Render principal de la pagina.
  return (
    <>
      {/* Fragmento para agrupar cabecera y contenido sin crear un contenedor extra. */}
      {/* Cabecera con menu y acciones. */}
      <Header />
      {/* Contenedor del contenido principal con padding. */}
      <main style={{ padding: 20 }}>
        {/* Titulo para contextualizar el feed. */}
        <h3>Publicaciones de tus seguidos</h3>
        {/* Lista paginada que consume /publications/following. */}
        <PublicationFollowing />
      </main>
    </>
  );
}
