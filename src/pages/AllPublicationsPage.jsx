// src/pages/AllPublicationsPage.jsx
import Header from "../components/Header";
import PublicationList from "../components/PublicationList";
import CreatePublication from "../components/CreatePublication";

/**
 * Pagina principal que muestra el header, el formulario de creacion y listado global.
 * @returns {JSX.Element} Layout con cabecera y todas las publicaciones del feed publico.
 */
export default function AllPublicationsPage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        {/* Formulario para crear una nueva publicacion antes del listado */}
        <CreatePublication />
        <h3>Todas las publicaciones</h3>
        {/* Listado paginado con todas las publicaciones publicas */}
        <PublicationList />
      </main>
    </>
  );
}



