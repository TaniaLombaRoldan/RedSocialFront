import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/useAuth";

/**
 * Muestra el perfil del usuario autenticado, con contadores y listas de seguidores/seguidos,
 * ademas de un formulario para cambiar el nombre de usuario.
 */
export default function MyUserProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [refreshTick, setRefreshTick] = useState(0);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [redirectMessage, setRedirectMessage] = useState("");

  const loadProfile = async () => {
    if (!user?.username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const profilePromise = apiFetch(`/users/public/${user.username}`);
      const followersPromise = apiFetch("/users/followers");
      const followingPromise = apiFetch("/users/following");

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
  };

  useEffect(() => {
    loadProfile();
  }, [user?.username, refreshTick]);

  useEffect(() => {
    const syncRefresh = () => setRefreshTick(Date.now());
    const storageHandler = (e) => {
      if (e.key === "followers-refresh-ts") syncRefresh();
    };

    window.addEventListener("followers-refresh", syncRefresh);
    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("followers-refresh", syncRefresh);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setUpdateError("El nombre de usuario no puede estar vacio.");
      return;
    }
    if (newUsername === user.username) {
      setUpdateError("El nuevo nombre debe ser diferente al actual.");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      await apiFetch("/users/change", {
        method: "PATCH",
        body: JSON.stringify({ username: newUsername }),
      });

      setRedirectMessage("Nombre actualizado. Seras redirigido al login...");

      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.replace("/login");
      }, 2000);
    } catch (err) {
      setUpdateError(err.message || "Error al actualizar el nombre.");
      setIsUpdating(false);
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;
  if (!profile) return <p>No se encontro el perfil del usuario.</p>;

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div>
        <h2 style={{ margin: "0 0 8px" }}>{profile.username}</h2>
        <p style={{ margin: "0 0 4px" }}>{profile.email}</p>
        <p style={{ margin: 0 }}>{profile.description || "Sin descripcion disponible"}</p>
      </div>

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
          <strong style={{ display: "block", fontSize: "1.2rem" }}>{followersCount}</strong>
          <span>Seguidores</span>
        </div>
        <div style={{ textAlign: "center", color: "#0f2c45" }}>
          <strong style={{ display: "block", fontSize: "1.2rem" }}>{followingCount}</strong>
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
        <div>
          <p style={{ margin: "6px 0", fontWeight: 600, color: "#0f2c45" }}>Seguidores</p>
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
            {followersList.map((u) => (
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
                  to={`/profile/${u.username}`}
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
            ))}
          </ul>
        </div>
      )}

      {showFollowing && (
        <div>
          <p style={{ margin: "6px 0", fontWeight: 600, color: "#0f2c45" }}>Siguiendo</p>
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
            {followingList.map((u) => (
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
                  to={`/profile/${u.username}`}
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
            ))}
          </ul>
        </div>
      )}

      <hr style={{ margin: "20px 0" }} />

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "10px 15px",
          cursor: "pointer",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        {showForm ? "Cancelar" : "Cambiar nombre de usuario"}
      </button>

      {showForm && (
        <form onSubmit={handleChangeUsername} style={{ marginTop: "12px" }}>
          <h3 style={{ marginBottom: "12px" }}>Cambiar nombre de usuario</h3>

          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="newUsername" style={{ display: "block", marginBottom: "5px" }}>
              Nuevo nombre de usuario:
            </label>
            <input
              id="newUsername"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Introduce tu nuevo username"
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" }}
              disabled={isUpdating}
            />
          </div>

          <button type="submit" disabled={isUpdating} style={{ padding: "8px 15px", cursor: "pointer" }}>
            {isUpdating ? "Actualizando..." : "Actualizar nombre"}
          </button>

          {updateError && <p style={{ color: "red", marginTop: "10px" }}>{updateError}</p>}

          {redirectMessage && (
            <p style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}>{redirectMessage}</p>
          )}
        </form>
      )}
    </div>
  );
}
