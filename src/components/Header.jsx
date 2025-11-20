// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * Encabezado principal que muestra la barra de navegacion y los controles de usuario.
 * Se carga en la parte superior de la aplicacion para ofrecer contexto y acciones rapidas.
 * @returns {JSX.Element} Barra superior con la marca de la app, enlaces y boton de cierre de sesion.
 */
export default function Header() {
  // Consumimos el contexto de autenticacion para obtener datos del usuario y el manejador de logout.
  const { user, logout } = useAuth();
  const linkStyle = {
    color: "var(--atlantar-light)",
    fontWeight: 600,
    letterSpacing: "0.04em",
  };

  // La estructura utiliza flexbox para alinear logo, navegacion y controles de usuario.
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 26px",
        background: "rgba(3, 31, 59, 0.85)",
        border: "1px solid rgba(244, 251, 255, 0.08)",
        borderRadius: "16px",
        margin: "10px 0 30px",
        color: "var(--atlantar-light)",
        boxShadow: "0 15px 40px rgba(3, 31, 59, 0.5)",
      }}
    >
      {/* Zona izquierda: mostramos la marca visible de la red social */}
      <h2 style={{ margin: 0, color: "var(--atlantar-foam)", letterSpacing: "0.08em" }}>
        Atlantar
      </h2>

      {/* Zona central: enlaces de navegacion para cambiar entre secciones principales */}
      <nav style={{ display: "flex", gap: 20 }}>
        {/* Inicio muestra el feed principal */}
        <Link to="/" style={linkStyle}>
          Inicio
        </Link>
        {/* Todas lista todas las publicaciones disponibles */}
        <Link to="/all" style={linkStyle}>
          Todas
        </Link>
        {/* Mi perfil lleva al muro personal del usuario */}
        <Link to="/me" style={linkStyle}>
          Mi perfil
        </Link>
      </nav>

      {/* Zona derecha: informacion del usuario autenticado y acciones de sesion */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Mostramos el username y usamos "Usuario" mientras no llega la data */}
        <Link
          to={user?.username ? `/profile/${user.username}` : "/me"}
          style={{
            marginRight: 10,
            color: "var(--atlantar-muted)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          {user?.username ?? "Usuario"}
        </Link>
        {/* Boton primario para cerrar la sesion actual */}
        <button
          onClick={logout}
          style={{
            background: "linear-gradient(120deg, var(--atlantar-foam), var(--atlantar-glow))",
            color: "var(--atlantar-deep)",
            borderRadius: "999px",
            border: "none",
            padding: "0.45rem 1.2rem",
          }}
        >
          Cerrar sesion
        </button>
      </div>
    </header>
  );
}
