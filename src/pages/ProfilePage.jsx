// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import ProfilePublication from "../components/ProfilePublication";
import UserProfile from "../components/UserProfile";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/useAuth";

/**
 * Pagina publica que muestra la informacion y publicaciones de un usuario especifico.
 * Usa el parametro :name de la URL para cargar datos y feed filtrado, aplicando la piel Atlantar.
 * @returns {JSX.Element} Cabecera, resumen del perfil y listado de publicaciones.
 */
export default function ProfilePage() {
  const { name } = useParams();
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState(null);
  const [profileRefresh, setProfileRefresh] = useState(0);

  useEffect(() => {
    let alive = true;
    setFollowError(null);

    // Si es mi propio perfil, no hay botón de seguir.
    if (!user || user.username === name) {
      setIsFollowing(false);
      return;
    }

    (async () => {
      try {
        const following = await apiFetch("/users/following");
        if (!alive) return;
        const already = Array.isArray(following)
          ? following.some((u) => u.username === name)
          : false;
        setIsFollowing(already);
      } catch (err) {
        if (alive) {
          setFollowError(err?.message || "No se pudo verificar seguimiento.");
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [name, user]);

  const handleFollow = async () => {
    if (followLoading || isFollowing) return;
    try {
      setFollowLoading(true);
      setFollowError(null);
      await apiFetch(`/users/follow/${name}`, { method: "POST" });
      setIsFollowing(true);
      setProfileRefresh((v) => v + 1);
    } catch (err) {
      setFollowError(err?.message || "No se pudo seguir al usuario.");
    } finally {
      setFollowLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleUnfollow = async () => {
    if (followLoading) return;
    try {
      setFollowLoading(true);
      setFollowError(null);
      await apiFetch(`/users/unfollow/${name}`, { method: "DELETE" });
      setIsFollowing(false);
      setProfileRefresh((v) => v + 1);
    } catch (err) {
      setFollowError(err?.message || "No se pudo dejar de seguir al usuario.");
    } finally {
      setFollowLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMainFollowClick = () => {
    if (isFollowing) handleUnfollow();
    else handleFollow();
  };

  return (
    <>
      <Header />
      <div className="atlantar-shell">
        <section className="atlantar-hero">
          <p className="atlantar-tagline">Atlantar perfil</p>
          <h1>@{name}</h1>
          {user?.username !== name && (
            <div style={{ position: "relative", alignSelf: "flex-end" }}>
              <button
                type="button"
                className="atlantar-follow-hero"
                onClick={handleMainFollowClick}
                disabled={followLoading}
              >
                {followLoading
                  ? "Procesando..."
                  : isFollowing
                  ? "Dejar de seguir"
                  : "Seguir"}
              </button>
            </div>
          )}
          {followError && (
            <p >{followError}</p>
          )}
        </section>

        <section className="atlantar-white-card">
          <UserProfile key={`${name}-${profileRefresh}`} />
        </section>

        <section className="atlantar-shadow-card">
          <ProfilePublication />
        </section>
      </div>
    </>
  );
}
