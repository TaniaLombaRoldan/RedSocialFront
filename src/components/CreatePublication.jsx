// src/components/CreatePublication.jsx
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatePublication({ onNewPublication }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Si el usuario no estǭ logueado, no mostramos el formulario
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
      const newPublication = await apiFetch("/publication/", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      // Limpiamos el formulario
      setText("");

      // Opcional: avisamos al padre (homepage) que hay una nueva publicaci��n
      if (onNewPublication) onNewPublication(newPublication);

      // Forzar refresco de listas relacionadas
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/publication/"], exact: false }),
        queryClient.invalidateQueries({ queryKey: [`/publication/public/${user.username}`], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["/publication/following"], exact: false }),
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
        maxWidth: "600px",
        margin: "20px auto",
        padding: "15px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Crea una nueva publicación</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿En que estás pensando"
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "none",
          }}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginTop: "10px",
            padding: "10px 15px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}






