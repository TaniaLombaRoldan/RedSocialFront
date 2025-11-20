// src/components/GetPublication.jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
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

  // Mutacion encargada de borrar la publicacion e invalidar las queries relacionadas.
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiFetch(`/publication/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      // Invalida cualquier query relacionada con publicaciones para refrescar la vista.
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.includes("/publication"),
      });
    },
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

  return (
    <div
      style={{
        border: "1px solid rgba(3, 31, 59, 0.08)",
        borderRadius: "18px",
        padding: "18px",
        marginBottom: "15px",
        backgroundColor: "#ffffff",
        color: "#111",
        boxShadow: "0 12px 32px rgba(3, 31, 59, 0.12)",
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
