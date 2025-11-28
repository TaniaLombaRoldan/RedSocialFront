// src/components/GetPublication.jsx
/**
 * Tarjeta que muestra una publicacion individual y permite borrarla si es del autor.
 * Comentada linea a linea en español sin modificar la logica.
 */
// Hooks de React para efectos y referencias.
import { useEffect, useRef } from "react";
// Mutaciones y cliente de React Query para borrar y refrescar cache.
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Navegacion programatica para ir a perfiles.
import { useNavigate } from "react-router-dom";
// Libreria de animaciones.
import { gsap } from "gsap";
// Hook de autenticacion para conocer el usuario actual.
import { useAuth } from "../hooks/useAuth";
// Cliente HTTP para la API.
import { apiFetch } from "../api/client";

/**
 * @typedef {Object} PublicationProps
 * @property {string} id Identificador unico de la publicacion.
 * @property {string} authorName Nombre del autor.
 * @property {string} text Contenido textual de la publicacion.
 * @property {string | number | Date} createDate Fecha interpretable por Date.
 */

/**
 * Muestra la informacion de una publicacion y habilita el borrado si el usuario es el autor.
 * Ofrece navegacion al perfil del autor y mantiene sincronizados los listados via React Query.
 * @param {PublicationProps} props
 * @returns {JSX.Element}
 */
export default function GetPublication({ id, authorName, text, createDate }) {
  // Usuario autenticado determina permisos sobre la publicacion.
  const { user } = useAuth();
  // Navegacion para saltar al perfil del autor.
  const navigate = useNavigate();
  // Cliente para invalidar caches despues de borrar.
  const queryClient = useQueryClient();
  // Ref al contenedor para animaciones de entrada.
  const pubRef = useRef(null);

  // Animacion de entrada al hacer scroll usando GSAP + ScrollTrigger (registrado en main.jsx).
  useEffect(() => {
    // Obtenemos el elemento de la publicacion.
    const el = pubRef.current;
    if (!el) return;

    // Estado inicial para la animacion.
    gsap.set(el, { opacity: 0, y: 50 });
    // Tween de entrada con ScrollTrigger.
    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true,
      },
    });

    // Limpieza del tween al desmontar.
    return () => {
      tween?.kill();
      gsap.killTweensOf(el);
    };
  }, []);

  // Mutacion encargada de borrar la publicacion e invalidar las queries relacionadas.
  const deleteMutation = useMutation({
    // Peticion DELETE al endpoint de la publicacion.
    mutationFn: async () => {
      await apiFetch(`/publications/${id}`, { method: "DELETE" });
    },
    // Al terminar, invalidamos cualquier query de publicaciones.
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.includes("/publications"),
      });
    },
    // Mostramos un alert basico si hay error al borrar.
    onError: (error) => {
      alert(`Error al borrar publicacion: ${error.message}`);
    },
  });

  // Confirma con el usuario y dispara la mutacion de borrado.
  const handleDelete = () => {
    if (window.confirm("Seguro que quieres borrar esta publicacion?")) {
      deleteMutation.mutate();
    }
  };

  // Render de la tarjeta.
  return (
    <div
      ref={pubRef}
      style={{
        border: "1px solid rgba(3, 31, 59, 0.08)",
        borderRadius: "18px",
        padding: "18px",
        marginBottom: "15px",
        backgroundColor: "#ffffff",
        color: "#111",
        boxShadow: "0 12px 32px rgba(3, 31, 59, 0.12)",
        opacity: 0,
        transform: "translateY(40px)",
      }}
    >
      <p>
        <strong
          style={{ cursor: "pointer", color: "var(--atlantar-mid)" }}
          onClick={() => navigate(`/profile/${authorName}`)}
        >
          {/* Permite visitar rapidamente el perfil del autor */}
          {authorName}
        </strong>{" "}
        <span
          style={{
            fontWeight: 700,
            color: "#7cc8ff",
            marginLeft: 6,
          }}
        >
          {/* Fecha de creacion formateada. */}
          {new Date(createDate).toLocaleString("es-ES", {
            timeZone: "Europe/Madrid",
          })}
        </span>
      </p>

      {/* Cuerpo principal de la publicacion */}
      <p>{text}</p>

      {/* Solo el autor puede borrar la publicacion */}
      {user?.username === authorName && (
        <button
          style={{
            color: "white",
            background: "linear-gradient(120deg, var(--atlantar-mid), var(--atlantar-foam))",
            border: "none",
            borderRadius: "999px",
            padding: "6px 18px",
            cursor: "pointer",
          }}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Borrando..." : "Borrar publicacion"}
        </button>
      )}
    </div>
  );
}
