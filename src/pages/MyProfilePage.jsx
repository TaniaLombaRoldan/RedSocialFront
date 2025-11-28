// src/pages/MyProfilePage.jsx
/**
 * Pagina del perfil propio que muestra datos personales y publicaciones propias.
 * Comentada linea a linea en español sin alterar comportamiento.
 */

// Cabecera global.
import Header from "../components/Header";
// Listado de publicaciones del usuario actual.
import MyPublication from "../components/MyPublication";
// Datos de perfil del usuario y formulario para editar username.
import MyUserProfile from "../components/MyUserProfile";

/**
 * Pagina del perfil propio que combina datos personales y publicaciones.
 * @returns {JSX.Element} Layout con cabecera, info del usuario y lista de publicaciones propias.
 */
export default function MyProfilePage() {
  // Render principal de la pagina.
  return (
    <>
      {/* Cabecera con navegacion y acciones. */}
      <Header />
      {/* Contenido principal con padding. */}
      <main style={{ padding: 20 }}>
        {/* Titulo de seccion. */}
        <h3>Mi perfil</h3>
        {/* Seccion con la informacion del usuario y formulario para cambiar el username. */}
        <MyUserProfile />
        {/* Texto descriptivo sobre las publicaciones del usuario. */}
        <p>Aqui veras tus publicaciones y podras editar tu nombre.</p>
      </main>
      {/* Lista paginada de publicaciones creadas por el usuario actual. */}
      <MyPublication />
    </>
  );
}
