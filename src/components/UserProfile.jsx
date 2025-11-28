// Perfil publico de un usuario con listas plegables de seguidores/seguidos.
// Comentado linea a linea en español sin modificar la logica.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../hooks/useAuth";

/**
 * Componente que muestra el perfil publico de un usuario con un resumen
 * compacto para email, descripcion y contadores, ademas de listas plegables.
 */
export default function UserProfile() {
  // Nombre del usuario visitado obtenido de la URL.
  const { name } = useParams();
  // Usuario autenticado para diferenciar enlaces a su propio perfil.
  const { user: authUser } = useAuth();

  // Estado del perfil cargado.
  const [profile, setProfile] = useState(null);
  // Flags de carga y error.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contadores de seguidores y seguidos.
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Listas detalladas de seguidores y seguidos.
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  // Flags para mostrar/ocultar listas.
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  // Cierra desplegables y hace scroll al top al navegar a otro usuario.
  const handleNavigateUser = () => {
    setShowFollowers(false);
    setShowFollowing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Carga datos del perfil y sus listas al montar o al cambiar el nombre visitado.
  useEffect(() => {
    // Garantiza que se vea el inicio al cambiar de perfil.
    window.scrollTo({ top: 0, behavior: "auto" });

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        // Peticiones en paralelo: datos del perfil, seguidores y seguidos publicos.
        const profilePromise = apiFetch(`/users/public/${name}`);
        const followersPromise = apiFetch(`/users/public/followers/${name}`);
        const followingPromise = apiFetch(`/users/public/following/${name}`);

        // Esperamos los tres resultados juntos.
        const [profileData, followersData, followingData] = await Promise.all([
          profilePromise,
          followersPromise,
          followingPromise,
        ]);

        // Actualizamos estado con los datos recibidos.
        setProfile(profileData);
        setFollowersList(followersData);
        setFollowersCount(followersData.length);
        setFollowingList(followingData);
        setFollowingCount(followingData.length);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [name]);

  // Estados de carga y error antes de renderizar datos.
  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;
  if (!profile) return <p>No se encontro el perfil del usuario.</p>;

  // Render principal del perfil publico.
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Email del perfil */}
      <p style={{ margin: 0, color: "#0f2c45", fontWeight: 600 }}>{profile.email}</p>
      {/* Descripcion del perfil */}
      <p style={{ margin: 0, color: "#2c3d4f" }}>
        {profile.description || "Sin descripcion disponible"}
      </p>

      {/* Contadores de seguidores y seguidos */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          border: "1px solid #e5e8ed",
          borderRadius: "10px",
          padding: "12px",
          backgroundColor: "#f6f8fb",
        }}
      >
        <div style={{ textAlign: "center", color: "#0f2c45" }}>
          <strong style={{ display: "block", fontSize: "1.2rem" }}>
            {followersCount}
          </strong>
          <span>Seguidores</span>
        </div>

        <div style={{ textAlign: "center", color: "#0f2c45" }}>
          <strong style={{ display: "block", fontSize: "1.2rem" }}>
            {followingCount}
          </strong>
          <span>Siguiendo</span>
        </div>
      </div>

      {/* Botones para desplegar/plegar listas */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={() => setShowFollowers(!showFollowers)}
          style={{
            cursor: "pointer",
            borderRadius: "10px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            padding: "10px 14px",
          }}
        >
          {showFollowers ? "Ocultar seguidores" : "Listar seguidores"}
        </button>

        <button
          onClick={() => setShowFollowing(!showFollowing)}
          style={{
            cursor: "pointer",
            borderRadius: "10px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            padding: "10px 14px",
          }}
        >
          {showFollowing ? "Ocultar seguidos" : "Listar seguidos"}
        </button>
      </div>

      {/* Lista de seguidores */}
      {showFollowers && (
        <div style={{ marginTop: "8px" }}>
          <p style={{ margin: "6px 0", fontWeight: 600, color: "#0f2c45" }}>
            Seguidores
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {followersList.map((u) => {
              // Si es el propio usuario autenticado, apunta a /me en lugar de /profile/:name.
              const target =
                authUser?.username && u.username === authUser.username
                  ? "/me"
                  : `/profile/${u.username}`;
              return (
              <li
                key={u.username}
                style={{
                  padding: "0",
                  backgroundColor: "#eef2f7",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Link
                  to={target}
                  onClick={handleNavigateUser}
                  style={{
                    display: "block",
                    padding: "8px 10px",
                    color: "#0f2c45",
                    textDecoration: "none",
                  }}
                >
                  {u.username}
                </Link>
              </li>
            );
            })}
          </ul>
        </div>
      )}

      {/* Lista de seguidos */}
      {showFollowing && (
        <div style={{ marginTop: "12px" }}>
          <p style={{ margin: "6px 0", fontWeight: 600, color: "#0f2c45" }}>
            Siguiendo
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {followingList.map((u) => {
              // Si es el usuario actual, navegamos a /me.
              const target =
                authUser?.username && u.username === authUser.username
                  ? "/me"
                  : `/profile/${u.username}`;
              return (
              <li
                key={u.username}
                style={{
                  padding: "0",
                  backgroundColor: "#eef2f7",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Link
                  to={target}
                  onClick={handleNavigateUser}
                  style={{
                    display: "block",
                    padding: "8px 10px",
                    color: "#0f2c45",
                    textDecoration: "none",
                  }}
                >
                  {u.username}
                </Link>
              </li>
            );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
