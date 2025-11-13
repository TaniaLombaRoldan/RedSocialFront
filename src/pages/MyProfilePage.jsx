// src/pages/MyProfilePage.jsx

import Header from "../components/Header";
import MyPublication from "../components/MyPublication";
import MyUserProfile from "../components/MyUserProfile";

/**
 * Pagina del perfil propio que combina datos personales y publicaciones.
 * @returns {JSX.Element} Layout con cabecera, info del usuario y lista de publicaciones propias.
 */
export default function MyProfilePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Mi perfil</h3>
        {/* Seccion con la informacion del usuario y formulario para cambiar el username */}
        <MyUserProfile />
        <p>Aqui veras tus publicaciones y podras editar tu nombre.</p>
      </main>
      {/* Lista paginada de publicaciones creadas por el usuario actual */}
      <MyPublication />
    </>
  );
}
