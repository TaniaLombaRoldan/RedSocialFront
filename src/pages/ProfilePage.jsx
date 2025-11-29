// src/pages/ProfilePage.jsx
/**
 * Pagina publica que muestra la informacion y publicaciones de un usuario especifico.
 * Se comenta linea a linea en español sin modificar la logica.
 */
// Importamos hooks de React para estado, refs y efectos.
import { useEffect, useRef, useState } from "react";
// Libreria de animaciones.
import { gsap } from "gsap";
// Hook de router para leer el parametro :name de la URL.
import { useParams } from "react-router-dom";
// Cabecera comun.
import Header from "../components/Header";
// Listado de publicaciones del perfil visitado.
import ProfilePublication from "../components/ProfilePublication";
// Datos del perfil visitado.
import UserProfile from "../components/UserProfile";
// Cliente HTTP.
import { apiFetch } from "../api/client";
// Hook de autenticacion para saber el usuario actual.
import { useAuth } from "../hooks/useAuth";

/**
 * Pagina publica que muestra la informacion y publicaciones de un usuario especifico.
 * Usa el parametro :name de la URL para cargar datos y feed filtrado, aplicando la piel Atlantar.
 * @returns {JSX.Element} Cabecera, resumen del perfil y listado de publicaciones.
 */
export default function ProfilePage() {
  // Extraemos el nombre de usuario de la URL.
  const { name } = useParams();
  // Usuario autenticado actual.
  const { user } = useAuth();
  // Estado: si estamos siguiendo al perfil visitado.
  const [isFollowing, setIsFollowing] = useState(false);
  // Estado: bandera de carga para seguir/dejar de seguir.
  const [followLoading, setFollowLoading] = useState(false);
  // Estado: mensaje de error en operaciones de follow/unfollow.
  const [followError, setFollowError] = useState(null);
  // Estado: contador para refrescar datos del perfil tras cambios.
  const [profileRefresh, setProfileRefresh] = useState(0);
  // Ref para animar la seccion hero.
  const heroRef = useRef(null);
  // Ref para animar el boton principal de seguir.
  const followBtnRef = useRef(null);

  // Animaciones de entrada al montar el componente.
  useEffect(() => {
    // Obtenemos el nodo del hero.
    const hero = heroRef.current;
    // Obtenemos el nodo del boton de seguir.
    const btn = followBtnRef.current;

    // Si existe hero, aplicamos animacion inicial y destino.
    if (hero) {
      // Estado inicial: opacidad baja, desplazamiento y skew.
      gsap.set(hero, { opacity: 0, y: 140, skewY: 10, scale: 0.86, filter: "blur(8px)" });
      // Animacion hacia estado final limpio.
      gsap.to(hero, {
        opacity: 1,
        y: 0,
        skewY: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power4.out",
        force3D: true,
        onComplete: () => gsap.set(hero, { clearProps: "transform,filter" }),
      });
    }

    // Animacion para el boton de seguir si existe.
    if (btn) {
      // Estado inicial reducido y rotado.
      gsap.set(btn, { opacity: 0, scale: 0.7, y: 26, rotation: -18 });
      // Transicion hacia estado visible normal.
      gsap.to(btn, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.95,
        delay: 0.15,
        ease: "back.out(2.6)",
        force3D: true,
        transformOrigin: "center center",
        onComplete: () => gsap.set(btn, { clearProps: "transform" }),
      });
    }
  }, []);

  // Efecto para consultar si seguimos al usuario y actualizar estado.
  useEffect(() => {
    // Flag para evitar setState tras desmontar.
    let alive = true;
    // Reseteamos error antes de iniciar chequeo.
    setFollowError(null);

    // Si es mi propio perfil o no hay usuario autenticado, no mostramos follow.
    if (!user || user.username === name) {
      setIsFollowing(false);
      return;
    }

    // Funcion async autoejecutable para consultar a quienes seguimos.
    (async () => {
      try {
        // Pedimos la lista de usuarios seguidos.
        const following = await apiFetch("/users/following");
        // Si el componente se desmonto, abortamos.
        if (!alive) return;
        // Verificamos si el listado contiene al perfil visitado.
        const already = Array.isArray(following)
          ? following.some((u) => u.username === name)
          : false;
        // Actualizamos estado segun el resultado.
        setIsFollowing(already);
      } catch (err) {
        // Si hay error y seguimos montados, guardamos el mensaje.
        if (alive) {
          setFollowError(err?.message || "No se pudo verificar seguimiento.");
        }
      }
    })();

    // Cleanup que marca la flag como falsa al desmontar.
    return () => {
      alive = false;
    };
  }, [name, user]);

  /**
   * Handler asincrono que pide a la API seguir al usuario visitado.
   * Marca la UI en carga, limpia errores previos y refresca el perfil al terminar.
   * @returns {Promise<void>} Promesa que resuelve cuando la API responde y el estado se actualiza.
   */
  const handleFollow = async () => {
    // Evitamos llamadas duplicadas o si ya seguimos.
    if (followLoading || isFollowing) return;
    try {
      // Activamos flag de carga y limpiamos error previo.
      setFollowLoading(true);
      setFollowError(null);
      // Llamamos al endpoint de seguir.
      await apiFetch(`/users/follow/${name}`, { method: "POST" });
      // Marcamos como siguiendo.
      setIsFollowing(true);
      // Incrementamos contador para refrescar datos del perfil.
      setProfileRefresh((v) => v + 1);
    } catch (err) {
      // Guardamos el mensaje de error en español o fallback.
      setFollowError(err?.message || "No se pudo seguir al usuario.");
    } finally {
      // Quitamos la bandera de carga y subimos al inicio de la pagina.
      setFollowLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Handler asincrono para dejar de seguir al usuario actual.
   * Gestiona las banderas de carga, captura errores y fuerza la recarga del perfil.
   * @returns {Promise<void>} Promesa resuelta tras completar la llamada.
   */
  const handleUnfollow = async () => {
    // Evitamos repeticion si ya esta cargando.
    if (followLoading) return;
    try {
      // Activamos flag de carga y limpiamos error previo.
      setFollowLoading(true);
      setFollowError(null);
      // Llamamos al endpoint de dejar de seguir.
      await apiFetch(`/users/unfollow/${name}`, { method: "DELETE" });
      // Marcamos como no siguiendo.
      setIsFollowing(false);
      // Refrescamos datos del perfil.
      setProfileRefresh((v) => v + 1);
    } catch (err) {
      // Guardamos el error si ocurre.
      setFollowError(err?.message || "No se pudo dejar de seguir al usuario.");
    } finally {
      // Quitamos flag y hacemos scroll al inicio.
      setFollowLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Handler principal que decide si ejecutar follow o unfollow.
   * Centraliza el click del CTA para mantener la logica en un unico punto.
   */
  const handleMainFollowClick = () => {
    // Si ya seguimos, ejecuta unfollow; si no, follow.
    if (isFollowing) handleUnfollow();
    else handleFollow();
  };

  // Render del componente.
  return (
    <>
      {/* Fragmento que envuelve cabecera y contenido sin sumar un contenedor extra al DOM. */}
      {/* Cabecera global. */}
      <Header />
      {/* Contenedor principal con estilos de tema Atlantar. */}
      <div className="atlantar-shell">
        {/* Hero con informacion y CTA de follow/unfollow. */}
        <section className="atlantar-hero" ref={heroRef}>
          {/* Etiqueta superior descriptiva. */}
          <p className="atlantar-tagline">Atlantar perfil</p>
          {/* Nombre del usuario visitado. */}
          <h1>@{name}</h1>
          {/* Solo mostramos boton de seguir si no es nuestro propio perfil. */}
          {user?.username !== name && (
            <div style={{ position: "relative", alignSelf: "flex-end" }}>
              {/* Boton principal para seguir o dejar de seguir. */}
              <button
                type="button"
                className="atlantar-follow-hero"
                onClick={handleMainFollowClick}
                disabled={followLoading}
                ref={followBtnRef}
              >
                {/* Texto dinamico segun estado de carga y seguimiento. */}
                {followLoading
                  ? "Procesando..."
                  : isFollowing
                  ? "Dejar de seguir"
                  : "Seguir"}
              </button>
            </div>
          )}
          {/* Mensaje de error si la accion de follow/unfollow fallo. */}
          {followError && (
            <p>{followError}</p>
          )}
        </section>

        {/* Tarjeta blanca con resumen de perfil; key fuerza refresco cuando cambia profileRefresh. */}
        <section className="atlantar-white-card">
          <UserProfile key={`${name}-${profileRefresh}`} />
        </section>

        {/* Tarjeta sombreada con el listado de publicaciones del perfil. */}
        <section className="atlantar-shadow-card">
          <ProfilePublication />
        </section>
      </div>
    </>
  );
}
