// src/components/CreatePublication.jsx
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";
import { useQueryClient } from "@tanstack/react-query";

/**
 * @typedef {Object} CreatePublicationProps
 * @property {(publication: Record<string, unknown>) => void} [onNewPublication]
 * Callback opcional para avisar al componente padre cuando se crea la publicacion.
 */

/**
 * Componente controlado que permite crear publicaciones para el usuario autenticado.
 * Valida el formulario, muestra errores y mantiene sincronizadas las listas relacionadas
 * forzando la invalidacion de queries en React Query.
 *
 * @param {CreatePublicationProps} props
 * @returns {JSX.Element}
 */
export default function CreatePublication({ onNewPublication }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return <p>Debes estar logueado para crear una publicacion.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("La publicacion no puede estar vacia.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newPublication = await apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      setText("");

      if (onNewPublication) onNewPublication(newPublication);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/publications/"], exact: false }),
        queryClient.invalidateQueries({ queryKey: [`/publications/public/${user.username}`], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["/publications/following"], exact: false }),
      ]);
    } catch (err) {
      setError(err.message || "Error al crear la publicacion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "20px auto 30px",
        padding: "50px 70px 50px 40px",
        background: "linear-gradient(135deg, rgba(3,31,59,0.85), rgba(10,79,112,0.75))",
        borderRadius: "20px",
        boxShadow: "0 25px 45px rgba(3,31,59,0.55)",
        border: "1px solid rgba(244,251,255,0.08)",
        color: "var(--atlantar-light)",
      }}
    >
      <h3 style={{ marginTop: 0, letterSpacing: "0.05em", color: "var(--atlantar-foam)" }}>
        Crea una nueva publicacion
      </h3>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <textarea
        value={text}
          onChange={(e) => setText(e.target.value)}
        placeholder="¿Qué estás pensando?"
        rows={4}
       style={{
         width: "100%",
        padding: "14px",
        borderRadius: "16px",
         border: "1px solid rgba(244,251,255,0.2)",
         resize: "none",
        backgroundColor: "#ffffff",
          color: "#082032",
          boxShadow: "0 10px 25px rgba(3,31,59,0.25)",
            
        '::placeholder': {
            color: "#082032"
    }
  }}
  disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting} style={{ alignSelf: "flex-end" }}>
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}
