// src/components/CreatePublication.jsx
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      text: "",
    },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: async ({ text }) =>
      apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      }),
    onSuccess: async (newPublication) => {
      reset();
      if (onNewPublication) onNewPublication(newPublication);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/publications/"], exact: false }),
        queryClient.invalidateQueries({ queryKey: [`/publications/public/${user.username}`], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["/publications/following"], exact: false }),
      ]);
    },
  });

  const onSubmit = async (values) => {
    if (!user) return;
    await mutation.mutateAsync(values);
  };

  const isDisabled = useMemo(
    () => !user || isSubmitting || mutation.isPending,
    [user, isSubmitting, mutation.isPending]
  );

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
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
        noValidate
      >
        <textarea
          placeholder={user ? "Que esta pasando?" : "Inicia sesion para publicar"}
          rows={4}
          {...register("text", {
            required: user ? "La publicacion no puede estar vacia." : false,
            minLength: {
              value: 3,
              message: "La publicacion debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 280,
              message: "La publicacion no puede superar los 280 caracteres.",
            },
          })}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "16px",
            border: "1px solid rgba(244,251,255,0.2)",
            resize: "none",
            backgroundColor: "#ffffff",
            color: "#082032",
            boxShadow: "0 10px 25px rgba(3,31,59,0.25)",
          }}
          disabled={isDisabled}
        />
        {errors.text && <p style={{ color: "red" }}>{errors.text.message}</p>}
        <button type="submit" disabled={isDisabled} style={{ alignSelf: "flex-end" }}>
          {mutation.isPending || isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
      {mutation.isError && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {mutation.error?.message || "Error al crear la publicacion."}
        </p>
      )}
    </div>
  );
}
