// src/pages/AllPublicationsPage.jsx
/**
 * Pagina principal que muestra header, formulario de creacion y el feed publico.
 * Se agregan comentarios linea a linea en español sin modificar la logica.
 */
// Cabecera global de la aplicacion.
import Header from "../components/Header";
// Listado paginado de publicaciones.
import PublicationList from "../components/PublicationList";
// Formulario para crear nuevas publicaciones.
import CreatePublication from "../components/CreatePublication";

/**
 * Pagina principal que muestra el header, el formulario de creacion y listado global.
 * @returns {JSX.Element} Layout con cabecera y todas las publicaciones del feed publico.
 */
export default function AllPublicationsPage() {
  // Render principal de la pagina.
  return (
    <>
      {/* Cabecera fija con navegacion y usuario. */}
      <Header />
      {/* Contenedor principal con padding para espaciar contenido. */}
      <main style={{ padding: 20 }}>
        {/* Formulario para crear una nueva publicacion antes del listado. */}
        <CreatePublication />
        {/* Titulo de seccion para el feed global. */}
        <h3>Todas las publicaciones</h3>
        {/* Listado paginado con todas las publicaciones publicas. */}
        <PublicationList />
      </main>
    </>
  );
}
