import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/useAuth";

/**
 * Componente que muestra el perfil público de un usuario con un resumen
 * compacto para email, descripción y contadores, además de listas plegables.
 */
export default function UserProfile() {
  const { name } = useParams();
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const handleNavigateUser = () => {
    // Al navegar a otro usuario, cerramos los desplegables y subimos a la cabecera.
    setShowFollowers(false);
    setShowFollowing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Aseguramos que cada vez que cambie el perfil visitado se muestre desde arriba.
    window.scrollTo({ top: 0, behavior: "auto" });

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const profilePromise = apiFetch(`/users/public/${name}`);
        const followersPromise = apiFetch(`/users/public/followers/${name}`);
        const followingPromise = apiFetch(`/users/public/following/${name}`);

        const [profileData, followersData, followingData] = await Promise.all([
          profilePromise,
          followersPromise,
          followingPromise,
        ]);

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

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;
  if (!profile) return <p>No se encontró el perfil del usuario.</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <p style={{ margin: 0, color: "#0f2c45", fontWeight: 600 }}>{profile.email}</p>
      <p style={{ margin: 0, color: "#2c3d4f" }}>
        {profile.description || "Sin descripción disponible"}
      </p>

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
