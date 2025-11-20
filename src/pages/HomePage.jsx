// src/pages/HomePage.jsx
import Header from "../components/Header";
import PublicationFollowing from "../components/PublicationFollowing";

/**
 * Pagina de inicio que muestra publicaciones de los usuarios seguidos.
 * @returns {JSX.Element} Layout con cabecera y feed personalizado.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Publicaciones de tus seguidos</h3>
        {/* Lista paginada que consume /publication/following */}
        <PublicationFollowing />
      </main>
    </>
  );
}



