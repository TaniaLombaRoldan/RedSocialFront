// src/components/MyUserProfile.jsx
/**
 * Perfil del usuario autenticado con contadores, listas de seguidores/seguidos
 * y formulario para cambiar el nombre de usuario.
 * Comentado linea a linea en español sin modificar la logica.
 */
// Hooks de React para estado y efectos.
import { useEffect, useState } from "react";
// Link para navegar a perfiles.
import { Link } from "react-router-dom";
// Cliente HTTP para consumir la API.
import { apiFetch } from "../api/client";
// Hook de autenticacion para obtener el usuario actual.
import { useAuth } from "../hooks/useAuth";

/**
 * Muestra el perfil del usuario autenticado, con contadores y listas de seguidores/seguidos,
 * ademas de un formulario para cambiar el nombre de usuario.
 */
export default function MyUserProfile() {
  // Usuario autenticado.
  const { user } = useAuth();

  // Estado de datos del perfil.
  const [profile, setProfile] = useState(null);
  // Flags de carga y error.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contadores y listas de seguidores/seguidos.
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  // Tick que fuerza refresco manual.
  const [refreshTick, setRefreshTick] = useState(0);

  // Toggles para mostrar/ocultar listas.
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  // Control del formulario de cambio de username.
  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [redirectMessage, setRedirectMessage] = useState("");

  // Carga el perfil y las listas relacionadas.
  const loadProfile = async () => {
    // Si no hay username, salimos y quitamos loading.
    if (!user?.username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Peticiones en paralelo: perfil, seguidores, seguidos.
      const profilePromise = apiFetch(`/users/public/${user.username}`);
      const followersPromise = apiFetch("/users/followers");
      const followingPromise = apiFetch("/users/following");

      // Esperamos todas y destructuramos resultados.
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
  };

  // Carga inicial y cuando cambia usuario o refreshTick.
  useEffect(() => {
    loadProfile();
  }, [user?.username, refreshTick]);

  // Escucha eventos de sync para refrescar contadores/listas desde otros tabs.
  useEffect(() => {
    const syncRefresh = () => setRefreshTick(Date.now());
    const storageHandler = (e) => {
      if (e.key === "followers-refresh-ts") syncRefresh();
    };

    // Evento custom y evento storage para multiples pestañas.
    window.addEventListener("followers-refresh", syncRefresh);
    window.addEventListener("storage", storageHandler);

    // Limpieza de listeners al desmontar.
    return () => {
      window.removeEventListener("followers-refresh", syncRefresh);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  // Handler para cambiar el nombre de usuario.
  const handleChangeUsername = async (e) => {
    e.preventDefault();
    // Validaciones basicas de entrada.
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
      // Peticion PATCH al backend con el nuevo username.
      await apiFetch("/users/change", {
        method: "PATCH",
        body: JSON.stringify({ username: newUsername }),
      });

      // Avisamos que redirigiremos al login para reautenticar.
      setRedirectMessage("Nombre actualizado. Seras redirigido al login...");

      // Limpiamos credenciales y redirigimos tras breve espera.
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.replace("/login");
      }, 2000);
    } catch (err) {
      // Normalizamos el mensaje para detectar el error especifico de datos invalidos y mostrar uno mas claro.
      const rawMsg = typeof err?.message === "string" ? err.message : "";
      const normalized = rawMsg
        ? rawMsg.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        : "";
      const msg = normalized.includes("datos invalidos")
        ? "Ese nombre de usuario ya esta en uso. Prueba con otro distinto."
        : rawMsg;

      // Mostramos error y permitimos reintento.
      setUpdateError(msg || "Error al actualizar el nombre.");
      setIsUpdating(false);
    }
  };

  // Estados iniciales de carga/errores/ausencia de perfil.
  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;
  if (!profile) return <p>No se encontro el perfil del usuario.</p>;

  // Render principal del perfil propio.
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
      {/* Bloque superior con nombre, email y descripcion */}
      <div>
        <h2 style={{ margin: "0 0 8px" }}>{profile.username}</h2>
        <p style={{ margin: "0 0 4px" }}>{profile.email}</p>
        <p style={{ margin: 0 }}>{profile.description || "Sin descripcion disponible"}</p>
      </div>

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
          <strong style={{ display: "block", fontSize: "1.2rem" }}>{followersCount}</strong>
          <span>Seguidores</span>
        </div>
        <div style={{ textAlign: "center", color: "#0f2c45" }}>
          <strong style={{ display: "block", fontSize: "1.2rem" }}>{followingCount}</strong>
          <span>Siguiendo</span>
        </div>
      </div>

      {/* Botones para mostrar/ocultar listas */}
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

      {/* Lista de seguidos */}
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

      {/* Toggle para mostrar/ocultar el formulario de cambio de username */}
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

      {/* Formulario de cambio de username */}
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

          {/* Mensaje de error si la actualizacion falla */}
          {updateError && <p style={{ color: "red", marginTop: "10px" }}>{updateError}</p>}

          {/* Mensaje informativo previo a redirigir */}
          {redirectMessage && (
            <p style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}>{redirectMessage}</p>
          )}
        </form>
      )}
    </div>
  );
}
